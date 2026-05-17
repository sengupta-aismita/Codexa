import { createRequire } from "module";
import Document from "../models/document.models.js";
import { chunkText } from "../utils/chunkText.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { generateEmbedding } from "../services/embedding.service.js";


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

  if(!chunks.length){
    throw new ApiError(400,"Chunk generation failed")
  }


  const processedChunks = [];

for (const chunk of chunks) {
  const embedding = await generateEmbedding(chunk);

  processedChunks.push({
    text: chunk,
    embedding,
  });
}

  const document = await Document.create({
    user: req.user._id,
    fileName: req.file.originalname,
    chunks: processedChunks
  });

  res.status(200).json(new ApiResponse(200,{ chunksStored: chunks.length},"Document processed successfully"))

  // res.status(201).json(
  //   new ApiResponse(
  //     201,
  //     document,
  //     "Successfully uploaded"
  //   )
  // );
});