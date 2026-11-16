const db = require("../config/db");
const bcrypt = require("bcrypt");

// ========================================
// GET MY PROFILE
// ========================================
const getMyProfile = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [users] = await db.query(
      `SELECT
        id,
        name,
        email,
        phone,
        role,
        created_at,
        updated_at
      FROM users
      WHERE id = ?`,
      [user_id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: users[0],
    });

  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ========================================
// UPDATE MY PROFILE
// ========================================
const updateMyProfile = async (req, res) => {
  try {
    const user_id = req.user.id;

    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    // ========================================
    // VALIDASI
    // ========================================
    if (!name && !email && !password && phone === undefined) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required",
      });
    }

    // ========================================
    // CEK USER
    // ========================================
    const [users] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [user_id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    // ========================================
    // CEK EMAIL
    // ========================================
    if (email && email !== user.email) {

      const [existingEmail] = await db.query(
        `SELECT id
         FROM users
         WHERE email = ?
         AND id != ?`,
        [email, user_id]
      );

      if (existingEmail.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    // ========================================
    // PHONE (opsional, kirim "" untuk menghapus)
    // ========================================
    if (phone && !/^\+?[0-9\s()-]{6,20}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    // ========================================
    // PASSWORD
    // ========================================
    let hashedPassword = user.password;

    if (password) {

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      hashedPassword = await bcrypt.hash(password, 10);
    }

    // ========================================
    // UPDATE
    // ========================================
    await db.query(
      `UPDATE users
       SET
         name = ?,
         email = ?,
         phone = ?,
         password = ?
       WHERE id = ?`,
      [
        name || user.name,
        email || user.email,
        phone === undefined ? user.phone : phone || null,
        hashedPassword,
        user_id,
      ]
    );

    // ========================================
    // RESPONSE
    // ========================================
    const [updatedUser] = await db.query(
      `SELECT
        id,
        name,
        email,
        phone,
        role,
        created_at,
        updated_at
      FROM users
      WHERE id = ?`,
      [user_id]
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser[0],
    });

  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports = {
  getMyProfile,
  updateMyProfile,
};