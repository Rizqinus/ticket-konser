const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

async function resetDatabase() {
  console.log("Menghubungkan ke server Supabase PostgreSQL...");

  const client = new Client({
    host: process.env.SUPABASE_HOST,
    port: parseInt(process.env.SUPABASE_PORT || "5432", 10),
    user: process.env.SUPABASE_USER,
    password: process.env.SUPABASE_PASSWORD,
    database: process.env.SUPABASE_DATABASE || "postgres",
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Terhubung ke Supabase. Mengosongkan tabel lama dan mengulang skema...");

    // Drop public tables
    await client.query(`
      DROP TABLE IF EXISTS 
        notifications,
        favorites,
        concert_artists,
        artists,
        tickets,
        payments,
        order_items,
        orders,
        ticket_categories,
        concerts,
        users
      CASCADE;
    `);

    const sqlPath = path.join(__dirname, "../supabase_schema.sql");
    const sql = fs.readFileSync(sqlPath, "utf-8");

    console.log("Mengeksekusi ulang seluruh isi supabase_schema.sql...");
    await client.query(sql);

    console.log("Database Supabase berhasil di-reset dan diperbarui dari supabase_schema.sql!");
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error("Gagal mereset database Supabase:", err.message);
    try {
      await client.end();
    } catch (e) {}
    process.exit(1);
  }
}

resetDatabase();
