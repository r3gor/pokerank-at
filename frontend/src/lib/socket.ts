// @deprecated
//
// import { io, Socket } from 'socket.io-client';
// import { config } from '../config/config';
//
// let socket: Socket | null = null;
//
// export const initSocket = (token?: string) => {
//   if (socket) {
//     socket.disconnect();
//   }
//
//   socket = io(config.WEBSOCKET_URL, {
//     query: { token: token || "" },
//   });
//
//   socket.on("connect", () => {
//     console.log("Socket conectado");
//   });
//
//   socket.on("disconnect", () => {
//     console.log("Socket desconectado");
//   });
//
//   return socket;
// };
//
// export const getSocket = () => {
//   if (!socket) {
//     console.warn("Socket no ha sido inicializado. Llama a initSocket primero.");
//   }
//   return socket;
// };
