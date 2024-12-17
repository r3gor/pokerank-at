import { ControllerPort } from "@ports/controler";
import { MiddlewarePort } from "@ports/middleware";
import { UserServicePort } from "@ports/services";
import { NextFunction, Request, Response, Router } from "express";

export class AdminController implements ControllerPort {
  constructor(
    private userService: UserServicePort,
    private tokenValidatorMiddleware: MiddlewarePort,
  ) {}

  registerRoutes = (router: Router): void => {
    router.get('/admin/dashboard', this.tokenValidatorMiddleware.handle, this.getAdminDashboard);
  }

  // TODO: paginacion
  getAdminDashboard = async (req: Request, res: Response, next: NextFunction) => {
    const users = await this.userService.getUsers();
    const userDashboards = await Promise.all(users.map(u => this.userService.getUserDashboard(u.id!)));

    res.json(userDashboards);
  }
}
