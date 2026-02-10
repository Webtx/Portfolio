import rateLimit from "express-rate-limit";

export const publicWriteLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      message: "Too many requests. Please try again later."
    }
  }
});

export const publicMessageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      message: "Too many messages sent. Please try again later."
    }
  }
});
