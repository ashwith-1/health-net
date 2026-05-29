const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const relativeRoutes = require("./routes/relativeRoutes");
const healthRoutes = require("./routes/healthRoutes");
const alertRoutes = require("./routes/alertRoutes");
const insuranceRoutes = require("./routes/insuranceRouter");
const emailRoutes=require("./routes/email.routes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🟢 CREATE HTTP SERVER
const server = http.createServer(app);

// 🟢 SOCKET SETUP
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
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
app.use("api/email", emailRoutes);
app.use("/api/hospitals", require("./routes/hospitalRoutes"));

// 🟢 DB CONNECT
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// 🟢 START SERVER
server.listen(5000, () => {
  console.log("Server Running on 5000");
});