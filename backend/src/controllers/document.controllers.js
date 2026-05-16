import { createRequire } from "module";
import Document from "../models/document.models.js";
import { chunkText } from "../utils/chunkText.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "PDF is required");
  }

  const pdfData = await pdfParse(req.file.buffer);

  const extractedText = pdfData.text;

  if (!extractedText?.trim()) {
    throw new ApiError(400, "No readable text found");
  }

  const chunks = chunkText(extractedText);

  const document = await Document.create({
    user: req.user._id,
    fileName: req.file.originalname,
    chunks: chunks.map((chunk) => ({
      text: chunk,
    })),
  });

  res.status(201).json(
    new ApiResponse(
      201,
      document,
      "Successfully uploaded"
    )
  );
});