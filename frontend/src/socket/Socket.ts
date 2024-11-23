import { Socket as SocketIOClient, io } from "socket.io-client";

const SOCKET_URL: string = import.meta.env.VITE_SOCKET_DEVELOPMENT;

const clintSocket: SocketIOClient = io(SOCKET_URL, { withCredentials: true });

export const Socket = () => {
    clintSocket.on('connect', () => {
        console.log(clintSocket.id);
    });

    return { clintSocket };
};
