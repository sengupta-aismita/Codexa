import { Router } from "express";
import {
  deleteThread,
  generateAIResponse,
  getSingleThread,
  getThreads, searchThreads
} from "../controllers/ai.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { aiLimiter } from "../middlewares/rateLimit.js";
const router = Router();

router.post("/message", verifyJWT, aiLimiter, generateAIResponse);
router.get("/threads", verifyJWT, getThreads);
router.get("/threads/search", verifyJWT, searchThreads)
router.get("/threads/:threadId", verifyJWT, getSingleThread);
router.delete("/threads/:threadId", verifyJWT, deleteThread);


export default router;
