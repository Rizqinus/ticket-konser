const path = require("path");
const { Pool, types } = require("pg");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
require("dotenv").config();

// Konfigurasi parser tipe data PostgreSQL agar serasi dengan kebutuhan frontend & mobile
// 1. OID 1082 (DATE) -> Kembalikan sebagai string 'YYYY-MM-DD' murni tanpa pergeseran timezone
types.setTypeParser(1082, (val) => val);
// 2. OID 1700 (NUMERIC / DECIMAL) -> Kembalikan sebagai number
types.setTypeParser(1700, (val) => (val === null ? null : parseFloat(val)));
// 3. OID 20 (BIGINT / COUNT) -> Kembalikan sebagai integer
types.setTypeParser(20, (val) => (val === null ? null : parseInt(val, 10)));

if (!process.env.SUPABASE_HOST && !process.env.SUPABASE_URL) {
  throw new Error("Koneksi database Supabase tidak ditemukan. Harap pastikan SUPABASE_HOST / SUPABASE_URL telah diisi pada file .env.");
}

const pool = process.env.SUPABASE_URL
  ? new Pool({
      connectionString: process.env.SUPABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })
  : new Pool({
      host: process.env.SUPABASE_HOST,
      port: parseInt(process.env.SUPABASE_PORT || "5432", 10),
      user: process.env.SUPABASE_USER,
      password: process.env.SUPABASE_PASSWORD,
      database: process.env.SUPABASE_DATABASE || "postgres",
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

// Konversi query MySQL (? placeholders, INTERVAL, IFNULL, dll.) ke dialek PostgreSQL
function convertSql(sql) {
  let paramIndex = 1;
  let s = sql.replace(/\?/g, () => `$${paramIndex++}`);

  // Penyesuaian sintaks interval: INTERVAL 15 MINUTE -> INTERVAL '15 minute'
  s = s.replace(/INTERVAL\s+(\d+)\s+([A-Za-z]+)/gi, "INTERVAL '$1 $2'");

  // Penyesuaian fungsi null: IFNULL -> COALESCE
  s = s.replace(/\bIFNULL\s*\(/gi, "COALESCE(");

  // Jika INSERT belum memiliki klausa RETURNING, tambahkan RETURNING * untuk mendapatkan id
  const clean = s.replace(/\/\*[\s\S]*?\*\/|--.*$/gm, "").trim().toUpperCase();
  if (clean.startsWith("INSERT") && !clean.includes("RETURNING")) {
    s += " RETURNING *";
  }

  return s;
}

// Eksekusi query dengan format pengembalian [rows/result, fields] sesuai standar aplikasi
async function executeQuery(executor, sql, params = []) {
  const finalSql = convertSql(sql);
  const res = await executor.query(finalSql, params);

  const clean = finalSql.replace(/\/\*[\s\S]*?\*\/|--.*$/gm, "").trim().toUpperCase();
  const isSelect = clean.startsWith("SELECT") || clean.startsWith("WITH") || clean.startsWith("SHOW");

  if (isSelect) {
    return [res.rows, null];
  }

  // Untuk operasi INSERT / UPDATE / DELETE
  const insertId = res.rows?.[0]?.id ? Number(res.rows[0].id) : undefined;
  const resultObj = {
    insertId: insertId,
    affectedRows: res.rowCount || 0,
    rowCount: res.rowCount || 0,
    rows: res.rows || [],
  };

  return [resultObj, null];
}

const db = {
  // Pool query utama
  query: (sql, params) => executeQuery(pool, sql, params),

  // Koneksi transaksi (beginTransaction, commit, rollback)
  getConnection: async () => {
    const client = await pool.connect();
    return {
      query: (sql, params) => executeQuery(client, sql, params),
      beginTransaction: () => client.query("BEGIN"),
      commit: () => client.query("COMMIT"),
      rollback: () => client.query("ROLLBACK"),
      release: () => client.release(),
    };
  },

  pool: pool,
};

module.exports = db;
