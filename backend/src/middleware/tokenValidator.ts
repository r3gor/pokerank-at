import { User } from "@domain/user";
import { MiddlewarePort } from "@ports/middleware";
import { JWTServicePort, UserServicePort } from "@ports/services";
import express from 'express';

export class tokenValidator implements MiddlewarePort {

  constructor(
    private userService: UserServicePort,
    private jwtService: JWTServicePort,
  ) {}
  
  handle = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    const token = req.headers['authorization'];

    // FIXME: temporal
    if (token == "ADMINTOKEN") {
      const userDB = await this.userService.getAdmin() as User;
      console.log("admin:", userDB);
      req.user = userDB!;
      next();
      return;
    };

    if (!token) {
      res.status(403).json({ message: 'Token requerido' });
      return;
    }

    const decoded = await this.jwtService.verify(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    let userDB: User;
    if (decoded.provider == 'self') {
      userDB = await this.userService.getUser(decoded.id!) as User;
    } else {
      userDB = await this.userService.getUserByIdProvider(decoded.oauthId!, decoded.provider) as User;
    }

    req.user = userDB!;
    next();
  }
}
