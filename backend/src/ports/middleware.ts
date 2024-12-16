import { RequestHandler } from "express";
import express from 'express';

export interface MiddlewarePort {
  handle(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;
}
