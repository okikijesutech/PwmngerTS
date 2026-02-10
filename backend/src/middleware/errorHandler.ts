import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import logger from "../utils/logger";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error({
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack,
      path: req.path,
    });
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  // Unexpected errors
  logger.error({
    message: "Unexpected Error",
    error: err.message,
    stack: err.stack,
    path: req.path,
  });

  res.status(500).json({
    error: "Internal server error",
  });
};
