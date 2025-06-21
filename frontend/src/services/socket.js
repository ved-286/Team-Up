import { io } from "socket.io-client";

// You can use an environment variable later instead of hardcoding the URL
const socket = io("http://localhost:5001", {
  withCredentials: true,
  transports: ['websocket'],
});

export default socket;