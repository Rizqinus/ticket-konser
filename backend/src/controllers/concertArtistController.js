const db = require("../config/db");

// ========================================
// GET ARTISTS BY CONCERT
// ========================================

const getConcertArtists = async (req, res) => {
  try {
    const { concertId } = req.params;

    const [artists] = await db.query(
      `
      SELECT
        a.id,
        a.name,
        a.description,
        a.image
      FROM concert_artists ca
      JOIN artists a
        ON ca.artist_id = a.id
      WHERE ca.concert_id = ?
      ORDER BY a.name ASC
      `,
      [concertId]
    );

    res.status(200).json({
      success: true,
      message: "Concert artists retrieved successfully",
      data: artists,
    });
  } catch (error) {
    console.error("Get Concert Artists Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// ADD ARTIST TO CONCERT
// ========================================

const addArtistToConcert = async (req, res) => {
  try {
    const { concertId } = req.params;
    let { artist_id, artist_name, name } = req.body;
    const targetName = (artist_name || name || "").toString().trim();

    // Cek concert
    const [concerts] = await db.query(
      `SELECT id, title FROM concerts WHERE id = ?`,
      [concertId]
    );

    if (concerts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Concert not found",
      });
    }

    // Auto-create jika nama artis diberikan tapi artist_id belum ada
    if (!artist_id && targetName) {
      const [existing] = await db.query(
        `SELECT id FROM artists WHERE LOWER(name) = LOWER(?) LIMIT 1`,
        [targetName]
      );
      if (existing.length > 0) {
        artist_id = existing[0].id;
      } else {
        const [newArtist] = await db.query(
          `INSERT INTO artists (name, description, image) VALUES (?, ?, ?)`,
          [targetName, `Pengisi acara konser ${concerts[0].title}`, "/concerts/indie-guitarist.jpg"]
        );
        artist_id = newArtist.insertId;
      }
    }

    if (!artist_id) {
      return res.status(400).json({
        success: false,
        message: "artist_id or artist_name is required",
      });
    }

    // Cek artist
    const [artists] = await db.query(
      `SELECT id, name FROM artists WHERE id = ?`,
      [artist_id]
    );

    if (artists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Artist not found",
      });
    }

    // Tambahkan lineup
    await db.query(
      `
      INSERT INTO concert_artists
      (concert_id, artist_id)
      VALUES (?, ?)
      `,
      [concertId, artist_id]
    );

    res.status(201).json({
      success: true,
      message: "Artist added to concert successfully",
      data: {
        concert_id: Number(concertId),
        artist_id: Number(artist_id),
        artist_name: artists[0].name,
      },
    });
  } catch (error) {
    // Duplicate artist di concert yang sama
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Artist is already in this concert",
      });
    }

    console.error("Add Concert Artist Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// REMOVE ARTIST FROM CONCERT
// ========================================

const removeArtistFromConcert = async (req, res) => {
  try {
    const { concertId, artistId } = req.params;

    const [result] = await db.query(
      `
      DELETE FROM concert_artists
      WHERE concert_id = ?
      AND artist_id = ?
      `,
      [concertId, artistId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Artist is not in this concert",
      });
    }

    res.status(200).json({
      success: true,
      message: "Artist removed from concert successfully",
    });
  } catch (error) {
    console.error("Remove Concert Artist Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getConcertArtists,
  addArtistToConcert,
  removeArtistFromConcert,
};