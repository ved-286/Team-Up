import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import { createServer } from "http";
import AuthRoutes from "./routes/AuthRoutes.js";
import { protect } from "./middlewares/authMiddleware.js";
import ProjectRoutes from "./routes/ProjectRoutes.js";
import TaskRoutes from "./routes/TaskRoutes.js";
import chatRoutes from "./routes/chatRoutes.js"; // Importing chat routes


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
    console.log("A user connected", socket.id);
    
    socket.on("join-chat", (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined chat room: ${chatId}`);
      // Log current rooms for this socket
      console.log(`Socket ${socket.id} rooms:`, Array.from(socket.rooms));
    });

    socket.on("new-message", (message) => {
      const chatId = message?.chat?._id || message?.chatId;
      console.log(`Received new-message from ${socket.id}:`, message);
      if (!chatId) {
        console.warn("new-message received without chatId/chat._id", message);
        return;
      }
      // Log all sockets in the room
      const roomSockets = io.sockets.adapter.rooms.get(chatId);
      console.log(`Emitting message-received to room ${chatId}. Sockets in room:`, roomSockets ? Array.from(roomSockets) : []);
      io.to(chatId).emit("message-received", message);
    });
    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
    });
}); 




app.use(cors());

app.use(express.json());

app.use("/api/auth", AuthRoutes);
app.use("/api/projects", ProjectRoutes);
app.use("/api/tasks", TaskRoutes); 
app.use("/api/chats", chatRoutes); // Assuming you have a chatRoutes.js file


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//i want tolearn about dsa in javascript.....so this is my last chance........






