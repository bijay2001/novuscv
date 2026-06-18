import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet"; 
import compression from "compression"; 
import rateLimit from "express-rate-limit"; 
import morgan from "morgan";             
import cookieParser from "cookie-parser"; 
import { createServer } from "http";
import { Server } from "socket.io";
import db from "./config/db.js";

// --- ROUTES ---
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config({ path: "./.env" });
process.env.TZ = "Asia/Kolkata";

// --- CRASH PREVENTION ---
process.on("uncaughtException", (err) => {
  console.error(`🔥 FATAL EXCEPTION: ${err.message}`);
  console.error(err.stack);
  // Shut down safely so the hosting provider can restart a fresh instance
  process.exit(1); 
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(`⚠️ Unhandled Promise Rejection:`, reason);
});

const app = express();
app.set('trust proxy', 1);
const httpServer = createServer(app);
const PORT = process.env.PORT || 6565;

// --- 1. SECURITY & PERFORMANCE MIDDLEWARE ---
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression()); 
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser()); 

// --- 2. LOGGING MIDDLEWARE ---
app.use(morgan("dev")); 

// --- 3. CORS CONFIGURATION (STRICT) ---
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); 
    
    if (allowedOrigins.includes(origin)) {
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
  max: 100, 
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

io.on("connection", (socket) => {
  // Socket logic here ...
});

// --- 6. API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/contact', contactRoutes);

// --- 7. GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// --- 8. START SERVER ---
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