import express, { Router } from 'express';
import { GooglePassport } from '../../adapters/passport/google';
import { JWTServicePort, UserServicePort } from '@ports/services';
import cfg from '../../config/config';
import { AuthController } from './controllers/auth';
import UserController from './controllers/user';
import { tokenValidator } from '../../middleware/tokenValidator';
import cors from 'cors';
import { AdminController } from './controllers/admin';

export class HttpApp {
  private router: express.IRouter;

  constructor (
    private userService: UserServicePort,
    private jwtService: JWTServicePort,
  ) {
    this.router = Router();

    const tokenValidatorMiddleware = new tokenValidator(
      this.userService,
      this.jwtService,
    );

    const authController = new AuthController(
      this.userService, 
      this.jwtService,
      [
        new GooglePassport(
          this.userService,
          {
            clientID: cfg.GOOGLE_CLIENT_ID!,
            clientSecret: cfg.GOOGLE_CLIENT_SECRET!,
          }
        ),
      ],
    );

    const userController = new UserController(
      this.userService,
      tokenValidatorMiddleware,
    )

    const adminController = new AdminController(
      this.userService,
      tokenValidatorMiddleware,
    )

    authController.registerRoutes(this.router);
    userController.registerRoutes(this.router);
    adminController.registerRoutes(this.router);
  }

  setup(app: express.Express) {
    app.use(cors({
      origin: 'http://localhost:3000', // FIXME: hardcode
      credentials: true,
    }));
    app.use(express.json())
    app.use(cfg.API_PREFIX!, this.router);
  }
}
