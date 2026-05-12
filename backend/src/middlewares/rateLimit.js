import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,

  message: {
    success: false,
    message: "Too many login attempts. Try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,

  message: {
    success: false,
    message: "Too many AI requests. Please wait a bit.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});
