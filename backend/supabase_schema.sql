-- Skema Database PostgreSQL untuk Supabase
-- Diadaptasi dari backend/db.sql untuk kompatibilitas penuh dengan Supabase

-- 1. Ekstensi UUID (opsional jika dibutuhkan di masa mendatang)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tipe Enum
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE concert_status AS ENUM ('upcoming', 'ongoing', 'finished');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_class AS ENUM ('Reguler', 'VIP', 'Festival');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'paid', 'cancelled', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM ('active', 'used', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Tabel Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Concerts
CREATE TABLE IF NOT EXISTS concerts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    concert_date DATE NOT NULL,
    concert_time TIME NOT NULL,
    image VARCHAR(255),
    status concert_status DEFAULT 'upcoming',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabel Ticket Categories
CREATE TABLE IF NOT EXISTS ticket_categories (
    id SERIAL PRIMARY KEY,
    concert_id INT NOT NULL REFERENCES concerts(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(100) NOT NULL,
    class ticket_class NOT NULL DEFAULT 'Reguler',
    price NUMERIC(12,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabel Orders
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    order_code VARCHAR(50) NOT NULL UNIQUE,
    total_price NUMERIC(12,2) NOT NULL,
    status order_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tabel Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    ticket_category_id INT NOT NULL REFERENCES ticket_categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    quantity INT NOT NULL,
    price NUMERIC(12,2) NOT NULL
);

-- 8. Tabel Payments
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    payment_method VARCHAR(50) NOT NULL,
    payment_status payment_status DEFAULT 'pending',
    payment_reference VARCHAR(100),
    snap_token VARCHAR(255),
    snap_redirect_url TEXT,
    qr_code TEXT,
    proof_image VARCHAR(255),
    sender_bank VARCHAR(100),
    sender_name VARCHAR(100),
    proof_uploaded_at TIMESTAMPTZ NULL,
    reject_reason VARCHAR(255),
    paid_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Tabel Tickets
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    ticket_category_id INT NOT NULL REFERENCES ticket_categories(id) ON DELETE CASCADE ON UPDATE CASCADE,
    ticket_code VARCHAR(100) NOT NULL UNIQUE,
    qr_code TEXT,
    status ticket_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Tabel Artists
CREATE TABLE IF NOT EXISTS artists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Tabel Concert Artists (Relasi Many to Many)
CREATE TABLE IF NOT EXISTS concert_artists (
    concert_id INT NOT NULL REFERENCES concerts(id) ON DELETE CASCADE ON UPDATE CASCADE,
    artist_id INT NOT NULL REFERENCES artists(id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (concert_id, artist_id)
);

-- 12. Tabel Favorites
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    concert_id INT NOT NULL REFERENCES concerts(id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_favorite UNIQUE (user_id, concert_id)
);

-- 13. Tabel Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Data Awal (Seed Data)
INSERT INTO concerts (title, description, location, concert_date, concert_time, status)
VALUES
('Coldplay World Tour', 'Live in Jakarta', 'GBK Jakarta', '2026-09-20', '19:00:00', 'upcoming'),
('Bruno Mars Live', 'Indonesia Tour', 'ICE BSD', '2026-10-10', '20:00:00', 'upcoming')
ON CONFLICT DO NOTHING;

INSERT INTO ticket_categories (concert_id, name, class, price, stock)
VALUES
(1, 'VIP', 'VIP', 1500000, 100),
(1, 'Festival', 'Festival', 800000, 500),
(1, 'Reguler', 'Reguler', 400000, 1000)
ON CONFLICT DO NOTHING;
