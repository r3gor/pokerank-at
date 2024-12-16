import { Router } from "express";

export interface ControllerPort {
  registerRoutes(router: Router): void;
}
