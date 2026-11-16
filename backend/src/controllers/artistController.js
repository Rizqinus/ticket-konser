const db = require("../config/db");

// ========================================
// GET ALL ARTISTS
// ========================================

const getArtists = async (req, res) => {
  try {
    const [artists] = await db.query(`
      SELECT
        id,
        name,
        description,
        image,
        created_at,
        updated_at
      FROM artists
      ORDER BY created_at DESC
    `);

    res.status(200).json({
      success: true,
      message: "Artists retrieved successfully",
      data: artists,
    });
  } catch (error) {
    console.error("Get Artists Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// GET ARTIST BY ID
// ========================================

const getArtistById = async (req, res) => {
  try {
    const { id } = req.params;

    const [artists] = await db.query(
      `
      SELECT
        id,
        name,
        description,
        image,
        created_at,
        updated_at
      FROM artists
      WHERE id = ?
      `,
      [id]
    );

    if (artists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Artist not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Artist retrieved successfully",
      data: artists[0],
    });
  } catch (error) {
    console.error("Get Artist Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// CREATE ARTIST
// ========================================

const createArtist = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Artist name is required",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO artists
      (
        name,
        description,
        image
      )
      VALUES (?, ?, ?)
      `,
      [
        name,
        description || null,
        image || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Artist created successfully",
      data: {
        id: result.insertId,
        name,
        description: description || null,
        image: image || null,
      },
    });
  } catch (error) {
    console.error("Create Artist Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// UPDATE ARTIST
// ========================================

const updateArtist = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      image,
    } = req.body;

    const [artists] = await db.query(
      `
      SELECT id
      FROM artists
      WHERE id = ?
      `,
      [id]
    );

    if (artists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Artist not found",
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Artist name is required",
      });
    }

    await db.query(
      `
      UPDATE artists
      SET
        name = ?,
        description = ?,
        image = ?
      WHERE id = ?
      `,
      [
        name,
        description || null,
        image || null,
        id,
      ]
    );

    res.status(200).json({
      success: true,
      message: "Artist updated successfully",
      data: {
        id: Number(id),
        name,
        description: description || null,
        image: image || null,
      },
    });
  } catch (error) {
    console.error("Update Artist Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// DELETE ARTIST
// ========================================

const deleteArtist = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      DELETE FROM artists
      WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Artist not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Artist deleted successfully",
    });
  } catch (error) {
    console.error("Delete Artist Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist,
};