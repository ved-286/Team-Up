import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import { createServer } from "http";


dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB();

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", 
      methods: ["GET", "POST"],
    },
  });

app.get('/', (req, res) => res.send('API is running...'));

io.on("connection", (socket) => {
    console.log("A user connected",socket.id);
    socket.on("disconnect", () => {
        console.log("A user disconnected",socket.id);
    });
}); 




app.use(cors());

app.use(express.json());


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});







