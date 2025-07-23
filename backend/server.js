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
    console.log("A user connected",socket.id);
    socket.on("disconnect", () => {
        console.log("A user disconnected",socket.id);
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







