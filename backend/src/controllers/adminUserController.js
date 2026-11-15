const db = require("../config/db");

// ========================================
// GET ALL USERS
// ========================================

const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT
        id,
        name,
        email,
        phone,
        role,
        created_at,
        updated_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// UPDATE USER ROLE
// ========================================

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validasi role
    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either user or admin",
      });
    }

    // Cek user
    const [users] = await db.query(
      `SELECT id, name, email, role FROM users WHERE id = ?`,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update role
    await db.query(
      `
      UPDATE users
      SET role = ?
      WHERE id = ?
      `,
      [role, id]
    );

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: {
        id: Number(id),
        name: users[0].name,
        email: users[0].email,
        role,
      },
    });
  } catch (error) {
    console.error("Update User Role Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
};