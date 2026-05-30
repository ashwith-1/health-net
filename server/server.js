const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const http = require("http");
const { Server } = require("socket.io");

// routes
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const relativeRoutes = require("./routes/relativeRoutes");
const healthRoutes = require("./routes/healthRoutes");
const alertRoutes = require("./routes/alertRoutes");
const insuranceRoutes = require("./routes/insuranceRouter");
const emailRoutes = require("./routes/email.routes");

dotenv.config();

const app = express();

// 🔥 FIX 1: CORS (IMPORTANT FOR VERCEL FRONTEND)
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());

// 🟢 HTTP SERVER
const server = http.createServer(app);

// 🟢 SOCKET FIX (IMPORTANT FOR PRODUCTION)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

app.set("io", io);

// 🟢 ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/relatives", relativeRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/insurance", insuranceRoutes);

// 🔥 FIX 2: missing slash bug corrected
app.use("/api/email", emailRoutes);

app.use("/api/hospitals", require("./routes/hospitalRoutes"));

// 🟢 DB CONNECT
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// 🟢 START SERVER
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});