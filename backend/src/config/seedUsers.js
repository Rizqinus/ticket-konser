const bcrypt = require("bcrypt");
const db = require("./db");

async function autoSeedUsers() {
  try {
    const [existing] = await db.query(
      "SELECT id, email, role FROM users WHERE email = 'admin@konser.id'"
    );

    if (!existing || existing.length === 0) {
      const pAdmin = await bcrypt.hash("admin123", 10);
      await db.query(
        "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?) ON CONFLICT (email) DO NOTHING",
        ["Admin Konser", "admin@konser.id", "081234567890", pAdmin, "admin"]
      );
      console.log("Seeded default admin: admin@konser.id / admin123");
    }
  } catch (err) {
    console.warn("Auto-seed users warning (non-blocking):", err.message);
  }
}

module.exports = autoSeedUsers;
