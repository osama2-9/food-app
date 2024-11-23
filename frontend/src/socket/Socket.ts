import socketIOClient from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET;
const clintSocket = socketIOClient(SOCKET_URL, { withCredentials: true });

export const Socket = () => {
    clintSocket.on('connect', () => {
        console.log(clintSocket.id);
    });
    return { clintSocket };
};
