const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./jobs/orderCron");
const autoSeedUsers = require("./config/seedUsers");
autoSeedUsers();

const authRoutes = require("./routes/authRoutes");
const concertRoutes = require("./routes/concertRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const artistRoutes = require("./routes/artistRoutes");

const path = require("path");
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads/posters", express.static(path.join(__dirname, "../uploads/posters")));
app.use("/uploads/artists", express.static(path.join(__dirname, "../uploads/artists")));

app.use("/api/auth", authRoutes);
app.use("/api/concerts", concertRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/artists", artistRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Gigpass API is running!",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});