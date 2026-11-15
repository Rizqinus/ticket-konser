const db = require("../config/db");

// ========================================
// GET MY FAVORITES
// ========================================
const getMyFavorites = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [favorites] = await db.query(
      `SELECT
        f.id,
        f.concert_id,
        c.title,
        c.description,
        c.location,
        c.concert_date,
        c.concert_time,
        c.image,
        c.status,
        f.created_at
      FROM favorites f
      JOIN concerts c
        ON f.concert_id = c.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC`,
      [user_id]
    );

    res.status(200).json({
      success: true,
      message: "Favorites retrieved successfully",
      data: favorites,
    });

  } catch (error) {
    console.error("Get Favorites Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ========================================
// ADD FAVORITE
// ========================================
const addFavorite = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { concertId } = req.params;

    // Cek konser
    const [concerts] = await db.query(
      "SELECT id FROM concerts WHERE id = ?",
      [concertId]
    );

    if (concerts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Concert not found",
      });
    }

    // Cek apakah sudah favorite
    const [existingFavorite] = await db.query(
      `SELECT id
       FROM favorites
       WHERE user_id = ?
       AND concert_id = ?`,
      [user_id, concertId]
    );

    if (existingFavorite.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Concert already added to favorites",
      });
    }

    // Tambahkan favorite
    await db.query(
      `INSERT INTO favorites
       (user_id, concert_id)
       VALUES (?, ?)`,
      [user_id, concertId]
    );

    res.status(201).json({
      success: true,
      message: "Concert added to favorites",
    });

  } catch (error) {
    console.error("Add Favorite Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ========================================
// DELETE FAVORITE
// ========================================
const removeFavorite = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { concertId } = req.params;

    const [result] = await db.query(
      `DELETE FROM favorites
       WHERE user_id = ?
       AND concert_id = ?`,
      [user_id, concertId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Concert removed from favorites",
    });

  } catch (error) {
    console.error("Remove Favorite Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports = {
  getMyFavorites,
  addFavorite,
  removeFavorite,
};