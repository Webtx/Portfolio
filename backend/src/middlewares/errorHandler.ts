import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { HttpError } from "../utils/httpError";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if ((err as any)?.name === "UnauthorizedError") {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: {
        message: err.message || "Unauthorized"
      }
    });
  }

  if (err instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: "Validation error",
        issues: err.issues
      }
    });
  }

  const statusCode = err instanceof HttpError ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    error: {
      message
    }
  });
};
