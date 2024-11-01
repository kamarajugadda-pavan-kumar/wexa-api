const express = require("express");
const rateLimit = require("express-rate-limit");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const { initWebSocket } = require("./webSocket/init");

// Setup WebSocket Server

const { ServerConfig } = require("./config");
const apiRoutes = require("./routes");

const app = express();
const server = require("http").createServer(app);
initWebSocket(server);

// =============================================================================
// Enable CORS (Cross-Origin Resource Sharing)
// =============================================================================
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = ["http://localhost:5173", "http://localhost:4173"];
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions)); // Enable CORS for all routes

// =============================================================================
// Rate limiting
// =============================================================================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", apiRoutes);

server.listen(ServerConfig.PORT, () => {
  console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});
