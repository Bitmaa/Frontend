import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:9000"; // backend server
const socket = io(SOCKET_URL, {
  withCredentials: true,
});

export default socket;
