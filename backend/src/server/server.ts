
import { GooglePassport } from '../adapters/passport/google';
import { PokemonRepo } from "../adapters/repository/mysql/pokemon";
import { UserRepo } from "../adapters/repository/mysql/user";
import { MedalRepo } from "../adapters/repository/mysql/medal";
import { JWTService } from "../services/jwt";
import { UserService } from "../services/user";
import { createServer } from "http";
import { HttpApp } from "./http/http";
import { WebSocketApp } from "./websocket/websocket";
import cfg from "../config/config";

import express from "express";
import socketio from "socket.io";
import mysql from 'mysql2/promise';
import { Server  } from "http"

GooglePassport;

export class ServerApp {
  private server: Server
  private app: express.Express;
  private io: socketio.Server;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new socketio.Server(this.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      }
    })

    const db = mysql.createPool({
      host: cfg.DB_HOST || 'localhost',
      port: Number(cfg.DB_PORT!),
      user: cfg.DB_USER || 'root',
      password: cfg.DB_PASSWORD || '',
      database: cfg.DB_NAME || 'testdb',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    const userRepo = new UserRepo(db);
    const pokemonRepo = new PokemonRepo(db);
    const medalRepo = new MedalRepo(db);

    const userService = new UserService(
      userRepo, pokemonRepo, medalRepo,
    );
    const jwtService = new JWTService(
      cfg.SECRET_KEY, cfg.JWT_EXPIRES
    );

    const http = new HttpApp(
      userService, jwtService,
    );

    const websocket = new WebSocketApp(
      userService, jwtService,
    );

    http.setup(this.app);
    websocket.setup(this.io);
  }

  run () {
    this.server.listen(cfg.PORT, () => {
      console.log(`Server running on :${cfg.PORT}`)
    });
  }
}
