const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

async function runSupabaseMigration() {
  console.log("Menghubungkan ke database Supabase...");

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
    console.log("Berhasil terhubung ke Supabase PostgreSQL.");

    const sqlPath = path.join(__dirname, "../supabase_schema.sql");
    const sqlContent = fs.readFileSync(sqlPath, "utf-8");

    console.log("Mengeksekusi skema database supabase_schema.sql...");
    await client.query(sqlContent);
    console.log("Skema database berhasil diterapkan!");

    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log("Daftar tabel di Supabase:");
    tablesRes.rows.forEach((row) => {
      console.log(` - ${row.table_name}`);
    });

    await client.end();
    console.log("Migrasi Supabase selesai dengan sukses.");
    process.exit(0);
  } catch (err) {
    console.error("Gagal menjalankan migrasi ke Supabase:", err.message);
    try {
      await client.end();
    } catch (e) {}
    process.exit(1);
  }
}

runSupabaseMigration();
