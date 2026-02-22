import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { env } from "../config/env";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpError } from "../utils/httpError";

type TurnstileVerifyResponse = {
  success: boolean;
  action?: string;
  ["error-codes"]?: string[];
};

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const verifyTurnstileToken = async (
  token: string,
  remoteIp?: string,
): Promise<TurnstileVerifyResponse> => {
  if (!env.TURNSTILE_SECRET_KEY) {
    if (env.NODE_ENV !== "production") {
      return { success: true };
    }
    throw new HttpError(
      "Turnstile is not configured on the server.",
      StatusCodes.SERVICE_UNAVAILABLE,
    );
  }

  const form = new URLSearchParams();
  form.set("secret", env.TURNSTILE_SECRET_KEY);
  form.set("response", token);
  if (remoteIp) form.set("remoteip", remoteIp);

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  if (!response.ok) {
    throw new HttpError(
      "Unable to verify security check right now. Please try again.",
      StatusCodes.BAD_GATEWAY,
    );
  }

  return (await response.json()) as TurnstileVerifyResponse;
};

export const requireTurnstile = (expectedAction: string) =>
  asyncHandler(
    async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
      const token =
        typeof req.body?.turnstileToken === "string"
          ? req.body.turnstileToken.trim()
          : "";

      if (!token) {
        throw new HttpError(
          "Please complete the security check and try again.",
          StatusCodes.BAD_REQUEST,
        );
      }

      const result = await verifyTurnstileToken(token, req.ip);

      if (!result.success) {
        throw new HttpError(
          "Security check failed. Please try again.",
          StatusCodes.BAD_REQUEST,
        );
      }

      if (result.action && result.action !== expectedAction) {
        throw new HttpError(
          "Security check mismatch. Please refresh and try again.",
          StatusCodes.BAD_REQUEST,
        );
      }

      next();
    },
  );
