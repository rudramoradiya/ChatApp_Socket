import { io, Socket } from "socket.io-client";

const backendBaseUrl = import.meta.env.VITE_APP_BACKEND_URL;

const socket: Socket = io(backendBaseUrl, {
  autoConnect: false,
  withCredentials: true,
  auth: {
    token: null,
  },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const connectSocket = () => {
  const token = localStorage.getItem("token");
  if (token) {
    socket.auth = { token };
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
