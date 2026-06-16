import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet"; 
import compression from "compression"; 
import rateLimit from "express-rate-limit"; 
import morgan from "morgan";             // <-- 1. Imported Morgan
import cookieParser from "cookie-parser"; // <-- Re-added Cookie Parser for secure Auth
import { createServer } from "http";
import { Server } from "socket.io";
import db from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// --- ROUTES ---
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: "./.env" });
process.env.TZ = "Asia/Kolkata";

// --- CRASH PREVENTION ---
process.on("uncaughtException", (err) => {
  console.error(`FATAL CRASH PREVENTED: ${err.message}`);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error(`Unhandled Promise Rejection: ${reason}`);
});

const app = express();
app.set('trust proxy', 1);
const httpServer = createServer(app);
const PORT = process.env.PORT || 6565;

// --- 1. SECURITY & PERFORMANCE MIDDLEWARE ---
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allows React to read images hosted on the express server
}));
app.use(compression()); // Compresses response bodies
app.use(express.json({ limit: "10mb" })); // Prevent huge payload crashes
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser()); // Critical for reading httpOnly auth cookies

// --- 2. LOGGING MIDDLEWARE ---
// The 'dev' format shows: HTTP Method | URL | Status Code | Response Time | File Size
app.use(morgan("dev")); 

// --- 3. CORS CONFIGURATION (STRICT) ---
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

const payuDomains = []; // Prevent undefined crash. Add payment gateways here if needed.

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); 
    
    if (allowedOrigins.includes(origin) || payuDomains.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS BLOCKED: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};
app.use(cors(corsOptions));

// --- 4. RATE LIMITING (API PROTECTION) ---
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, 
  message: { success: false, message: "Too many requests, please try again later." }
});
app.use("/api/", apiLimiter);

// --- 5. SOCKET.IO SETUP ---
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket logic...
io.on("connection", (socket) => {
  //  Socket logic here ...
});

// --- 6. STATIC UPLOAD FOLDERS (NATIVE FS) ---
const uploadDirs = ["customer_profile"];
uploadDirs.forEach((dir) => {
  const p = path.join(__dirname, "uploads", dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res, path, stat) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
  },
}));

// Serves the admin/image directory so your images map perfectly
app.use("/admin/image", express.static(path.join(__dirname, "admin", "image"), {
  setHeaders: (res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
  },
}));

// --- 7. API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);

// --- 8. GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// --- 9. START SERVER ---
async function startServer() {
  try {
    await db.testConnection();
    httpServer.listen(PORT, () => {
      console.log(`Backend Server running on Port :${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();