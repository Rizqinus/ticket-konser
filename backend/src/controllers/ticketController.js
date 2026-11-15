const db = require("../config/db");

// GET MY TICKETS

const getMyTickets = async (req, res) => {
    try {
        //Ambil id user dari token jwt
        const user_id = req.user.id;

        const [tickets] = await db.query(
            `SELECT
        t.id AS ticket_id,
        t.ticket_code,
        t.qr_code,
        t.status AS ticket_status,

        o.id AS order_id,
        o.order_code,

        tc.name AS ticket_category,
        tc.price,

        c.id AS concert_id,
        c.title AS concert_title,
        c.description,
        c.location,
        c.concert_date,
        c.concert_time,
        c.image

      FROM tickets t

      JOIN orders o
        ON t.order_id = o.id

      JOIN ticket_categories tc
        ON t.ticket_category_id = tc.id

      JOIN concerts c
        ON tc.concert_id = c.id

      WHERE o.user_id = ?

      ORDER BY t.created_at DESC`,
      [
        user_id
      ]
        );

        res.status(200).json({
            success: true,
            message: "Ticket retrivied successfully",
            data: tickets,
        })
    } catch (error) {
        console.error(
            "Get My Tickets Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
};

const validateTicket = async (req, res) => {
  try {

    const {
      ticket_code,
    } = req.body;


    // ========================================
    // VALIDASI INPUT
    // ========================================

    if (!ticket_code) {
      return res.status(400).json({
        success: false,
        message: "ticket_code is required",
      });
    }


    // ========================================
    // CARI TIKET
    // ========================================

    const [tickets] = await db.query(
      `SELECT
        t.id AS ticket_id,
        t.ticket_code,
        t.status AS ticket_status,

        o.order_code,

        tc.name AS ticket_category,

        c.title AS concert_title,
        c.location,
        c.concert_date,
        c.concert_time

      FROM tickets t

      JOIN orders o
        ON t.order_id = o.id

      JOIN ticket_categories tc
        ON t.ticket_category_id = tc.id

      JOIN concerts c
        ON tc.concert_id = c.id

      WHERE t.ticket_code = ?`,
      [
        ticket_code,
      ]
    );


    // ========================================
    // TIKET TIDAK DITEMUKAN
    // ========================================

    if (tickets.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }


    const ticket = tickets[0];


    // ========================================
    // CEK STATUS TIKET
    // ========================================

    if (ticket.ticket_status === "used") {
      return res.status(400).json({
        success: false,
        message: "Ticket has already been used",
        data: ticket,
      });
    }


    if (ticket.ticket_status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Ticket has been cancelled",
        data: ticket,
      });
    }


    // ========================================
    // TIKET VALID
    // ========================================

    res.status(200).json({
      success: true,
      message: "Ticket is valid",
      data: ticket,
    });

  } catch (error) {

    console.error(
      "Validate Ticket Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// USE TICKET
// ========================================

const useTicket = async (req, res) => {
  try {

    const { ticket_code } = req.body;

    // Validasi input
    if (!ticket_code) {
      return res.status(400).json({
        success: false,
        message: "ticket_code is required",
      });
    }

    // Cari tiket
    const [tickets] = await db.query(
      `SELECT
        id,
        ticket_code,
        status
      FROM tickets
      WHERE ticket_code = ?`,
      [ticket_code]
    );

    if (tickets.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const ticket = tickets[0];

    // Sudah dipakai
    if (ticket.status === "used") {
      return res.status(400).json({
        success: false,
        message: "Ticket has already been used",
      });
    }

    // Dibatalkan
    if (ticket.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Ticket has been cancelled",
      });
    }

    // Update status
    await db.query(
      `UPDATE tickets
       SET status = 'used'
       WHERE id = ?`,
      [ticket.id]
    );

    res.status(200).json({
      success: true,
      message: "Ticket used successfully",
      data: {
        ticket_code: ticket.ticket_code,
        status: "used",
      },
    });

  } catch (error) {

    console.error("Use Ticket Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};

// ========================================
// SCAN / VERIFY TICKET
// ========================================

const scanTicket = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { ticket_code } = req.body;

    // ========================================
    // VALIDASI INPUT
    // ========================================

    if (!ticket_code) {
      return res.status(400).json({
        success: false,
        message: "ticket_code is required",
      });
    }

    await connection.beginTransaction();

    // ========================================
    // CARI DAN LOCK TIKET
    // ========================================

    const [tickets] = await connection.query(
      `
      SELECT
        t.id AS ticket_id,
        t.ticket_code,
        t.status AS ticket_status,

        o.id AS order_id,
        o.order_code,

        tc.id AS ticket_category_id,
        tc.name AS ticket_category,

        c.id AS concert_id,
        c.title AS concert_title,
        c.location,
        c.concert_date,
        c.concert_time

      FROM tickets t

      JOIN orders o
        ON t.order_id = o.id

      JOIN ticket_categories tc
        ON t.ticket_category_id = tc.id

      JOIN concerts c
        ON tc.concert_id = c.id

      WHERE t.ticket_code = ?

      FOR UPDATE
      `,
      [ticket_code]
    );

    // ========================================
    // TIKET TIDAK DITEMUKAN
    // ========================================

    if (tickets.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const ticket = tickets[0];

    // ========================================
    // CEK STATUS
    // ========================================

    if (ticket.ticket_status === "used") {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Ticket has already been used",
        data: ticket,
      });
    }

    if (ticket.ticket_status === "cancelled") {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Ticket has been cancelled",
        data: ticket,
      });
    }

    if (ticket.ticket_status !== "active") {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: `Ticket cannot be used because its status is ${ticket.ticket_status}`,
        data: ticket,
      });
    }

    // ========================================
    // UPDATE TICKET
    // ========================================

    await connection.query(
      `
      UPDATE tickets
      SET status = 'used'
      WHERE id = ?
      `,
      [ticket.ticket_id]
    );

    // ========================================
    // COMMIT
    // ========================================

    await connection.commit();

    // ========================================
    // RESPONSE
    // ========================================

    res.status(200).json({
      success: true,
      message: "Ticket verified successfully",

      data: {
        ticket_id: ticket.ticket_id,
        ticket_code: ticket.ticket_code,

        order_id: ticket.order_id,
        order_code: ticket.order_code,

        ticket_category_id: ticket.ticket_category_id,
        ticket_category: ticket.ticket_category,

        concert_id: ticket.concert_id,
        concert_title: ticket.concert_title,

        location: ticket.location,
        concert_date: ticket.concert_date,
        concert_time: ticket.concert_time,

        status: "used",
      },
    });

  } catch (error) {

    await connection.rollback();

    console.error("Scan Ticket Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  } finally {
    connection.release();
  }
};
//module exports

module.exports = {
    getMyTickets,
    validateTicket,
    useTicket,
    scanTicket,
}