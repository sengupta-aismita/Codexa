import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/upload.middlewares.js";
import { uploadDocument } from "../controllers/document.controllers.js";
import { askDocument } from "../controllers/rag.controllers.js";

const router = Router();

router.post(
  "/upload",
  verifyJWT,
  upload.single("file"),
  uploadDocument
);

router.post("/ask", verifyJWT, askDocument);

export default router;