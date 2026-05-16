import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/upload.middlewares.js";
import { uploadDocument } from "../controllers/document.controllers.js";

const router = Router();

router.post(
  "/upload",
  verifyJWT,
  upload.single("pdf"),
  uploadDocument
);

export default router;