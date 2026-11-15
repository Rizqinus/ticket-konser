const db = require("../config/db");

// ========================================
// GET SEMUA KONSER
// ========================================
const getAllConcerts = async (req, res) => {
  try {
    const [concerts] = await db.query(`
      SELECT *
      FROM concerts
      ORDER BY concert_date ASC
    `);

    const [categories] = await db.query(`
      SELECT id, concert_id, name, class, price, stock
      FROM ticket_categories
    `);

    const [lineups] = await db.query(`
      SELECT ca.concert_id, a.id, a.name, a.image, a.description
      FROM concert_artists ca
      JOIN artists a ON ca.artist_id = a.id
      ORDER BY a.name ASC
    `);

    const concertMap = concerts.map((c) => {
      const concertTickets = categories.filter((tc) => tc.concert_id === c.id);
      // Deduplikasi tiket per konser agar tidak ada tiket ganda per kategori
      const uniqueTickets = [];
      const seenClasses = new Set();
      for (const t of concertTickets) {
        const key = (t.class || t.name || "").toUpperCase();
        if (!seenClasses.has(key)) {
          seenClasses.add(key);
          uniqueTickets.push(t);
        }
      }

      return {
        ...c,
        tickets: uniqueTickets,
        artists: lineups.filter((l) => l.concert_id === c.id),
      };
    });

    res.status(200).json({
      success: true,
      message: "Concerts retrieved successfully",
      data: concertMap,
    });
  } catch (error) {
    console.error("Get Concerts Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// GET DETAIL KONSER
// ========================================
const getConcertById = async (req, res) => {
  try {
    const { id } = req.params;

    const [concert] = await db.query(
      "SELECT * FROM concerts WHERE id = ?",
      [id]
    );

    if (concert.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Concert not found",
      });
    }

    const [artists] = await db.query(
      `SELECT a.id, a.name, a.image, a.description
       FROM concert_artists ca
       JOIN artists a ON ca.artist_id = a.id
       WHERE ca.concert_id = ?
       ORDER BY a.name ASC`,
      [id]
    );

    const [tickets] = await db.query(
      `SELECT id, concert_id, name, class, price, stock
       FROM ticket_categories
       WHERE concert_id = ?`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Concert retrieved successfully",
      data: {
        ...concert[0],
        artists,
        tickets,
      },
    });
  } catch (error) {
    console.error("Get Concert Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// CREATE KONSER
// ========================================
const createConcert = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      concert_date,
      concert_time,
      status,
    } = req.body;

    let image = req.body.image || null;
    if (req.file) {
      image = `/uploads/posters/${req.file.filename}`;
    }

    let tickets = req.body.tickets;
    if (typeof tickets === "string") {
      try {
        tickets = JSON.parse(tickets);
      } catch (e) {
        tickets = null;
      }
    }

    // Validasi input wajib
    if (
      !title ||
      !location ||
      !concert_date ||
      !concert_time
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, location, concert date, and concert time are required",
      });
    }

    // Insert data konser
    const [result] = await db.query(
      `INSERT INTO concerts
      (
        title,
        description,
        location,
        concert_date,
        concert_time,
        image,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        location,
        concert_date,
        concert_time,
        image || null,
        status || "upcoming",
      ]
    );

    const concertId = result.insertId;

    // Insert tiket (Reguler, VIP, Festival) jika disertakan
    if (tickets) {
      const ticketList = Array.isArray(tickets)
        ? tickets
        : Object.entries(tickets).map(([cls, data]) => ({ class: cls, ...data }));

      for (const t of ticketList) {
        if (t.price !== undefined && t.stock !== undefined) {
          const rawClass = (t.class || t.name || "Reguler").toString().trim();
          let validClass = "Reguler";
          if (/^vip$/i.test(rawClass)) validClass = "VIP";
          else if (/^festival$/i.test(rawClass)) validClass = "Festival";
          else if (/^reguler|regular$/i.test(rawClass)) validClass = "Reguler";

          const ticketName = (t.name || validClass).toString().trim();
          await db.query(
            `INSERT INTO ticket_categories (concert_id, name, class, price, stock)
             VALUES (?, ?, ?, ?, ?)`,
            [concertId, ticketName, validClass, Number(t.price) || 0, Number(t.stock) || 0]
          );
        }
      }
    }

    // Insert lineup artis jika disertakan (dukung auto-create)
    let artists = req.body.artists || req.body.lineup;
    if (typeof artists === "string") {
      try {
        artists = JSON.parse(artists);
      } catch (e) {
        artists = [artists];
      }
    }

    const insertedArtists = [];
    if (Array.isArray(artists) && artists.length > 0) {
      for (const item of artists) {
        let artistId = null;
        let artistName = "";

        if (typeof item === "number" || (!isNaN(item) && Number(item) > 0)) {
          const [exist] = await db.query(`SELECT id, name FROM artists WHERE id = ?`, [Number(item)]);
          if (exist.length > 0) {
            artistId = exist[0].id;
            artistName = exist[0].name;
          }
        } else if (typeof item === "string" && item.trim()) {
          artistName = item.trim();
          const [exist] = await db.query(
            `SELECT id, name FROM artists WHERE LOWER(name) = LOWER(?) LIMIT 1`,
            [artistName]
          );

          if (exist.length > 0) {
            artistId = exist[0].id;
          } else {
            // Auto-create artis baru yang belum terdaftar di master
            const [newArtist] = await db.query(
              `INSERT INTO artists (name, description, image) VALUES (?, ?, ?)`,
              [
                artistName,
                `Pengisi acara konser ${title}`,
                "/concerts/indie-guitarist.jpg",
              ]
            );
            artistId = newArtist.insertId;
          }
        } else if (typeof item === "object" && item !== null) {
          if (item.id) {
            artistId = item.id;
            artistName = item.name || "";
            if (item.image) {
              await db.query(
                `UPDATE artists SET image = ?, description = COALESCE(?, description) WHERE id = ?`,
                [item.image, item.description || null, artistId]
              );
            }
          } else if (item.name && item.name.trim()) {
            artistName = item.name.trim();
            const [exist] = await db.query(
              `SELECT id, name FROM artists WHERE LOWER(name) = LOWER(?) LIMIT 1`,
              [artistName]
            );
            if (exist.length > 0) {
              artistId = exist[0].id;
              if (item.image) {
                await db.query(
                  `UPDATE artists SET image = ?, description = COALESCE(?, description) WHERE id = ?`,
                  [item.image, item.description || null, artistId]
                );
              }
            } else {
              const [newArtist] = await db.query(
                `INSERT INTO artists (name, description, image) VALUES (?, ?, ?)`,
                [
                  artistName,
                  item.description || `Pengisi acara konser ${title}`,
                  item.image || "/concerts/indie-guitarist.jpg",
                ]
              );
              artistId = newArtist.insertId;
            }
          }
        }

        if (artistId) {
          try {
            await db.query(
              `INSERT INTO concert_artists (concert_id, artist_id) VALUES (?, ?)`,
              [concertId, artistId]
            );
            insertedArtists.push({ id: artistId, name: artistName });
          } catch (dupErr) {
            // Abaikan jika duplikasi
          }
        }
      }
    }

    res.status(201).json({
      success: true,
      message: "Concert created successfully",
      data: {
        id: result.insertId,
        title,
        description,
        location,
        concert_date,
        concert_time,
        image,
        status: status || "upcoming",
        artists: insertedArtists,
      },
    });
  } catch (error) {
    console.error("Create Concert Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// UPDATE KONSER
// ========================================
const updateConcert = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      location,
      concert_date,
      concert_time,
      status,
      tickets: rawTickets,
    } = req.body;

    if (!title || !location || !concert_date) {
      return res.status(400).json({
        success: false,
        message: "Title, location, and concert_date are required",
      });
    }

    let image = req.body.image;
    if (req.file) {
      image = `/uploads/posters/${req.file.filename}`;
    }

    // Cek apakah konser ada
    const [existingConcert] = await db.query(
      "SELECT id, image, description, location, concert_time FROM concerts WHERE id = ?",
      [id]
    );

    if (existingConcert.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Concert not found",
      });
    }

    const current = existingConcert[0];
    // Gunakan image lama jika tidak ada image baru yang dikirim
    const finalImage = image !== undefined && image !== "" ? image : current.image;
    // Pertahankan deskripsi lama jika deskripsi baru tidak diisi atau kosong
    const finalDescription = description !== undefined && description !== "" ? description : current.description;

    // Update data konser
    await db.query(
      `UPDATE concerts
      SET
        title = ?,
        description = ?,
        location = ?,
        concert_date = ?,
        concert_time = ?,
        image = ?,
        status = ?
      WHERE id = ?`,
      [
        title,
        finalDescription || null,
        location || current.location,
        concert_date,
        concert_time || current.concert_time || "19:00:00",
        finalImage || null,
        status || "upcoming",
        id,
      ]
    );

    // Update kategori tiket jika disertakan
    let ticketList = [];
    if (rawTickets) {
      try {
        ticketList = typeof rawTickets === "string" ? JSON.parse(rawTickets) : rawTickets;
      } catch (e) {
        ticketList = [];
      }
    }

    if (Array.isArray(ticketList) && ticketList.length > 0) {
      for (const t of ticketList) {
        const rawClass = (t.class || t.name || "Reguler").toString().trim();
        let validClass = "Reguler";
        if (/^vip$/i.test(rawClass)) validClass = "VIP";
        else if (/^festival$/i.test(rawClass)) validClass = "Festival";
        else if (/^reguler|regular$/i.test(rawClass)) validClass = "Reguler";

        const ticketName = (t.name || validClass).toString().trim();
        const [existing] = await db.query(
          "SELECT id FROM ticket_categories WHERE concert_id = ? AND (LOWER(class) = LOWER(?) OR LOWER(name) = LOWER(?)) ORDER BY id ASC",
          [id, validClass, validClass]
        );

        if (existing.length > 0) {
          await db.query(
            "UPDATE ticket_categories SET name = ?, class = ?, price = ?, stock = ? WHERE id = ?",
            [ticketName, validClass, Number(t.price) || 0, Number(t.stock) || 0, existing[0].id]
          );
          // Hapus baris duplikat jika ada lebih dari 1 untuk kelas yang sama
          if (existing.length > 1) {
            for (let i = 1; i < existing.length; i++) {
              await db.query("DELETE FROM ticket_categories WHERE id = ?", [existing[i].id]);
            }
          }
        } else {
          await db.query(
            "INSERT INTO ticket_categories (concert_id, name, class, price, stock) VALUES (?, ?, ?, ?, ?)",
            [id, ticketName, validClass, Number(t.price) || 0, Number(t.stock) || 0]
          );
        }
      }
    }

    // Update lineup artis jika disertakan
    let artists = req.body.artists || req.body.lineup;
    if (typeof artists === "string") {
      try {
        artists = JSON.parse(artists);
      } catch (e) {
        artists = [artists];
      }
    }

    if (Array.isArray(artists)) {
      await db.query(`DELETE FROM concert_artists WHERE concert_id = ?`, [id]);

      for (const item of artists) {
        let artistId = null;
        let artistName = "";

        if (typeof item === "number" || (!isNaN(item) && Number(item) > 0)) {
          const [exist] = await db.query(`SELECT id, name FROM artists WHERE id = ?`, [Number(item)]);
          if (exist.length > 0) artistId = exist[0].id;
        } else if (typeof item === "string" && item.trim()) {
          artistName = item.trim();
          const [exist] = await db.query(
            `SELECT id, name FROM artists WHERE LOWER(name) = LOWER(?) LIMIT 1`,
            [artistName]
          );
          if (exist.length > 0) {
            artistId = exist[0].id;
          } else {
            const [newArtist] = await db.query(
              `INSERT INTO artists (name, description, image) VALUES (?, ?, ?)`,
              [artistName, `Pengisi acara konser ${title}`, "/concerts/indie-guitarist.jpg"]
            );
            artistId = newArtist.insertId;
          }
        } else if (typeof item === "object" && item !== null) {
          if (item.id) {
            artistId = item.id;
            if (item.image) {
              await db.query(`UPDATE artists SET image = ?, description = COALESCE(?, description) WHERE id = ?`, [item.image, item.description, artistId]);
            }
          } else if (item.name && item.name.trim()) {
            artistName = item.name.trim();
            const [exist] = await db.query(
              `SELECT id, name FROM artists WHERE LOWER(name) = LOWER(?) LIMIT 1`,
              [artistName]
            );
            if (exist.length > 0) {
              artistId = exist[0].id;
              if (item.image) {
                await db.query(`UPDATE artists SET image = ?, description = COALESCE(?, description) WHERE id = ?`, [item.image, item.description, artistId]);
              }
            } else {
              const [newArtist] = await db.query(
                `INSERT INTO artists (name, description, image) VALUES (?, ?, ?)`,
                [artistName, item.description || `Pengisi acara konser ${title}`, item.image || "/concerts/indie-guitarist.jpg"]
              );
              artistId = newArtist.insertId;
            }
          }
        }

        if (artistId) {
          try {
            await db.query(
              `INSERT INTO concert_artists (concert_id, artist_id) VALUES (?, ?) ON CONFLICT DO NOTHING`,
              [id, artistId]
            );
          } catch (dupErr) {}
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Concert updated successfully",
    });
  } catch (error) {
    console.error("Update Concert Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteConcert = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah konser ada
    const [existingConcert] = await db.query(
      "SELECT id FROM concerts WHERE id = ?",
      [id]
    );

    if (existingConcert.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Concert not found",
      });
    }

    // Hapus konser
    await db.query(
      "DELETE FROM concerts WHERE id = ?",
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Concert deleted successfully",
    });

  } catch (error) {
    console.error("Delete Concert Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}; 

// EXPORT SEMUA FUNCTION

module.exports = {
  getAllConcerts,
  getConcertById,
  createConcert,
  updateConcert,
  deleteConcert,
};