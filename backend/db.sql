CREATE DATABASE concert_ticket;

USE concert_ticket;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE concerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    concert_date DATE NOT NULL,
    concert_time TIME NOT NULL,
    image VARCHAR(255),
    status ENUM('upcoming', 'ongoing', 'finished') DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE ticket_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    concert_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ticket_concert
        FOREIGN KEY (concert_id)
        REFERENCES concerts(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_code VARCHAR(50) NOT NULL UNIQUE,
    total_price DECIMAL(12,2) NOT NULL,
    status ENUM(
        'pending',
        'paid',
        'cancelled',
        'expired'
    ) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    ticket_category_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,

    CONSTRAINT fk_item_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_item_ticket
    FOREIGN KEY (ticket_category_id)
    REFERENCES ticket_categories(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status ENUM(
        'pending',
        'success',
        'failed'
    ) DEFAULT 'pending',
    payment_reference VARCHAR(100),
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    ticket_category_id INT NOT NULL,
    ticket_code VARCHAR(100) NOT NULL UNIQUE,
    qr_code TEXT,
    status ENUM(
        'active',
        'used',
        'cancelled'
    ) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ticket_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
		ON DELETE RESTRICT	
        ON UPDATE CASCADE,

    CONSTRAINT fk_ticket_category
        FOREIGN KEY (ticket_category_id)
        REFERENCES ticket_categories(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

INSERT INTO concerts
(title, description, location, concert_date, concert_time, status)

VALUES
(
'Coldplay World Tour',
'Live in Jakarta',
'GBK Jakarta',
'2026-09-20',
'19:00:00',
'upcoming'
),
(
'Bruno Mars Live',
'Indonesia Tour',
'ICE BSD',
'2026-10-10',
'20:00:00',
'upcoming'
);

INSERT INTO ticket_categories
(concert_id, name, price, stock)
VALUES
(1, 'VIP', 1500000, 100),
(1, 'Festival', 800000, 500),
(1, 'Regular', 400000, 1000);

UPDATE users
SET role = 'Wonyoung'
WHERE email = 'admin@skibidi.com';

select * from users;
SELECT * FROM ticket_categories;
show tables;
describe ticket_categories;
select * from order_items;
drop tables order_items;
select * from orders;
select * from payments;
select * from tickets;
select * from concerts;

SELECT
    p.id AS payment_id,
    p.order_id,
    p.payment_status,
    o.user_id,
    o.status AS order_status
FROM payments p
JOIN orders o
    ON p.order_id = o.id;
    
    SELECT
    id,
    ticket_code,
    status
FROM tickets;

UPDATE users
SET role = 'admin'
WHERE email = 'admin@skibidi.com';