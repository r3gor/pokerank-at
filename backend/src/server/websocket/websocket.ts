import { JWTServicePort, UserServicePort } from "@ports/services";
import { Server, Socket } from "socket.io";
import { Pokemon, User } from "../../domain";
import UserWSController from "./controllers/user";
import { AdminWSController } from "./controllers/admin";

export class WebSocketApp {
  constructor(
    private userService: UserServicePort,
    private jwtService: JWTServicePort,
  ) {


  };

  setup(io: Server) {

    const userWSController = new UserWSController(
      this.userService, io,
    );
    const adminWSController = new AdminWSController(
      this.userService, io,
    );

    // Middleware
    io.use(async (socket: Socket, next) => {
      const token = socket.handshake.query.token as string;

      // FIXME: temporal
      if (token == "ADMINTOKEN") {
        const userDB = await this.userService.getAdmin() as User;
        socket.data.user = userDB;
        socket.join('admins');
        next();
        return;
      };

      if (!token) {
        return next(new Error('No token provided'));
      }

      const decoded = await this.jwtService.verify(token) as User;
      if (!decoded) {
        return next(new Error('Invalid token'));
      }

      let userDB: User;
      if (decoded.provider == 'self') {
        userDB = await this.userService.getUser(decoded.id!) as User;
      } else {
        userDB = await this.userService.getUserByIdProvider(decoded.oauthId!, decoded.provider) as User;
      }

      socket.data.user = userDB;

      if (decoded.role === 'ad') {
        socket.join('admins');
      } else {
        socket.join('users');
        socket.join(`user-${userDB.id}`);
      }

      next();
    });

    io.on('connection', (socket: Socket) => {
      const user = socket.data.user as User;
      console.log(`[WS] Usuario conectado: ${user.username} (${user.role})`);

      if (user.role == "us") {
        userWSController.registerEvents(socket);
      }
      if (user.role == "ad") {
        adminWSController.registerEvents(socket);
      }

      socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${user.username}`);
      });
    });

  }
}
