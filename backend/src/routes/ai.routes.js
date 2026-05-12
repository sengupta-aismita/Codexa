import { Router } from "express";
import {
  deleteThread,
  generateAIResponse,
  getSingleThread,
  getThreads,
} from "../controllers/ai.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { aiLimiter } from "../middlewares/rateLimit.js";
const router = Router();

router.post("/message", verifyJWT, aiLimiter, generateAIResponse);
router.get("/threads", verifyJWT, getThreads);
router.get("/thread/:threadId", verifyJWT, getSingleThread);
router.delete("/thread/:threadId", verifyJWT, deleteThread);

export default router;
