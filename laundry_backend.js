// node /Users/audreywen/Desktop/laundry/laundry-time/laundry_backend.js

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const db = new sqlite3.Database("laundry.db");

app.use(bodyParser.json());

// Initialize database (keep as is)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS plugs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    ip TEXT,
    current REAL,
    state TEXT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Modify the /update route to accept demo data
app.post("/update", (req, res) => {
  const { name, ip, current, state } = req.body;
  // Insert demo data into the database
  db.run(
    "INSERT INTO plugs (name, ip, current, state, last_updated) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",
    [name, ip, current, state],
    (err) => {
      if (err) {
        res.status(500).send({ error: "Database error" });
      } else {
        // Broadcast update to frontend
        io.emit("update", { name, ip, current, state });
        res.send({ success: true });
      }
    }
  );
});

// Modify the /plugs route to return demo data
app.get("/plugs", (req, res) => {
  // Sample demo data
  const demoData = [
    { id: 1, name: "Washer 1", ip: "192.168.1.10", current: 5, state: "available", last_updated: "2025-03-28T10:00:00" },
    { id: 2, name: "Dryer 1", ip: "192.168.1.11", current: 3, state: "occupied", last_updated: "2025-03-28T10:05:00" },
    { id: 3, name: "Washer 2", ip: "192.168.1.12", current: 4, state: "offline", last_updated: "2025-03-28T10:10:00" },
    { id: 4, name: "Dryer 2", ip: "192.168.1.13", current: 2, state: "available", last_updated: "2025-03-28T10:15:00" }
  ];

  res.send(demoData);
});

io.on("connection", (socket) => {
  console.log("Client connected");
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
