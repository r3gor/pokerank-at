import { Router } from "express";
import { JWTServicePort, UserServicePort } from "../ports/services";
import { ControllerPort } from "../ports/controler";
import { PassportStrategyPort } from "../ports/passport";
import { User } from "@domain/user";
import cfg from "../config/config";

export class AuthController implements ControllerPort {
  constructor(
    private userService: UserServicePort,
    private jwtService: JWTServicePort,
    private passportStrategies: PassportStrategyPort[],
  ){ }

  registerRoutes(router: Router): void {
    for (let s of this.passportStrategies) {
      router.get(`/auth/${s.name}`, s.handleAuth())
      router.get(`/auth/${s.name}/callback`, s.handleRedirect(),
        async (req, res) => {
          if (!req.user) {
            res.status(400).send('Usuario no autenticado');
            return;
          }
          const user = req.user as User;
          if (!user.id) {
            const userId = await this.userService.createUser(user);
            if (userId) user.id = userId;
          }

          const token = this.jwtService.sign(user);

          // res.json({ token, user: req.user });
          res.redirect(`${cfg.WEB_URL}/auth/success?token=${token}`);
        }
      )
    }
  }
}
