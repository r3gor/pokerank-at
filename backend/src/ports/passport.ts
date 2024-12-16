import { RequestHandler } from "express";

export interface PassportStrategyPort {
  name: string,
  handleAuth(): RequestHandler;
  handleRedirect(): RequestHandler;
};

