const db = require("../config/db");

// ========================================
// GET ADMIN REPORT
// ========================================

const getAdminReport = async (req, res) => {
  try {
    const {
      start_date,
      end_date,
      concert_id,
    } = req.query;

    // ========================================
    // FILTER
    // ========================================

    let where = `
      WHERE p.payment_status = 'success'
    `;

    const params = [];

    if (start_date) {
      where += ` AND DATE(p.paid_at) >= ?`;
      params.push(start_date);
    }

    if (end_date) {
      where += ` AND DATE(p.paid_at) <= ?`;
      params.push(end_date);
    }

    if (concert_id) {
      where += ` AND c.id = ?`;
      params.push(concert_id);
    }

    // ========================================
    // STATISTIK UTAMA
    // ========================================

    const [summary] = await db.query(
      `
      SELECT
        COUNT(DISTINCT p.id) AS total_transactions,

        COALESCE(SUM(o.total_price), 0)
          AS total_revenue,

        COALESCE(SUM(oi.quantity), 0)
          AS total_tickets_sold

      FROM payments p

      JOIN orders o
        ON p.order_id = o.id

      JOIN order_items oi
        ON o.id = oi.order_id

      JOIN ticket_categories tc
        ON oi.ticket_category_id = tc.id

      JOIN concerts c
        ON tc.concert_id = c.id

      ${where}
      `,
      params
    );

    // ========================================
    // PENJUALAN PER KONSER
    // ========================================

    const [concertSales] = await db.query(
      `
      SELECT
        c.id AS concert_id,
        c.title AS concert_title,

        COUNT(DISTINCT p.id)
          AS total_transactions,

        COALESCE(SUM(oi.quantity), 0)
          AS tickets_sold,

        COALESCE(
          SUM(oi.quantity * oi.price),
          0
        ) AS revenue

      FROM payments p

      JOIN orders o
        ON p.order_id = o.id

      JOIN order_items oi
        ON o.id = oi.order_id

      JOIN ticket_categories tc
        ON oi.ticket_category_id = tc.id

      JOIN concerts c
        ON tc.concert_id = c.id

      ${where}

      GROUP BY
        c.id,
        c.title

      ORDER BY revenue DESC
      `,
      params
    );

    // ========================================
    // PENJUALAN PER TANGGAL
    // ========================================

    const [dailySales] = await db.query(
      `
      SELECT
        DATE(p.paid_at) AS date,

        COUNT(DISTINCT p.id)
          AS total_transactions,

        COALESCE(SUM(oi.quantity), 0)
          AS tickets_sold,

        COALESCE(
          SUM(oi.quantity * oi.price),
          0
        ) AS revenue

      FROM payments p

      JOIN orders o
        ON p.order_id = o.id

      JOIN order_items oi
        ON o.id = oi.order_id

      JOIN ticket_categories tc
        ON oi.ticket_category_id = tc.id

      JOIN concerts c
        ON tc.concert_id = c.id

      ${where}

      GROUP BY DATE(p.paid_at)

      ORDER BY date ASC
      `,
      params
    );

    // ========================================
    // RESPONSE
    // ========================================

    res.status(200).json({
      success: true,
      message: "Admin report retrieved successfully",

      filters: {
        start_date: start_date || null,
        end_date: end_date || null,
        concert_id: concert_id || null,
      },

      data: {
        summary: summary[0],
        concert_sales: concertSales,
        daily_sales: dailySales,
      },
    });

  } catch (error) {
    console.error("Get Admin Report Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAdminReport,
};