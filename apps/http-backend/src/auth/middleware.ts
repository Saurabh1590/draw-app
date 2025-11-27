import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config";

export function middleware(req: Request, res: Response, next: NextFunction) {
    
  interface JWTPayload {
    userId: string;
  }

  const token = req.headers["authorization"] ?? "";

  const decoded = jwt.verify(token, JWT_SECRET_KEY) as JWTPayload;

  if (decoded) {
    req.userId = decoded.userId;
    next();
  } else {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
}
