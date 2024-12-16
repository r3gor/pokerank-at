import { ControllerPort } from "@ports/controler";
import { MiddlewarePort } from "@ports/middleware";
import { UserServicePort } from "@ports/services";
import { Router, Request, Response, NextFunction } from "express";


import { User as DomainUser, User } from '@domain/user';

declare global {
  namespace Express {
    interface User extends DomainUser {}
  }
}

// TODO: validate payload
export default class UserController implements ControllerPort {
  constructor(
    private userService: UserServicePort,
    private tokenValidatorMiddleware: MiddlewarePort,
  ) {}

  registerRoutes = (router: Router): void => {
    router.get('/user', this.tokenValidatorMiddleware.handle, this.getUser);
  }

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const user = await this.userService.getUser(userId!) as User; // FIXME: validate
    const medals = await this.userService.getMedalScore(userId!);
    delete user.hashed_password;
    res.json({ user, medals });
  }
  
  getUserByProvider = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.oauthId;
    const provider = req.user?.provider;

    const user = await this.userService.getUserByIdProvider(userId!, provider!) as User; // FIXME: validate
    delete user.hashed_password;
    res.json(user);
  }
}