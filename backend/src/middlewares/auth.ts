import { auth } from "express-oauth2-jwt-bearer";
import { StatusCodes } from "http-status-codes";
import { env } from "../config/env";
import { HttpError } from "../utils/httpError";
import { Request, Response, NextFunction } from "express";

export const requireAuth = auth({
  issuerBaseURL: env.AUTH0_ISSUER_BASE_URL,
  audience: env.AUTH0_AUDIENCE
});

export const requireAdmin = (req: Request, _res: Response, next: NextFunction) => {
  const payload = (req as any).auth?.payload || {};
  const permissions: string[] = payload.permissions || [];
  const scope: string = payload.scope || "";
  const hasPermission =
    permissions.includes(env.ADMIN_PERMISSION) ||
    scope.split(" ").includes(env.ADMIN_PERMISSION);

  if (!hasPermission) {
    return next(new HttpError("Admin permission required", StatusCodes.FORBIDDEN));
  }

  return next();
};
