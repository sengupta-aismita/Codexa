import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

import Document from "../models/document.models.js";

import { generateEmbedding } from "../services/embedding.service.js";
import { generateAnswer } from "../services/llm.service.js";

import { cosineSimilarity } from "../utils/cosine.js";
import Thread from "../models/thread.models.js";

export const askDocument = asyncHandler(async (req, res) => {
  const { question } = req.body;

  if (!question || question.trim() === "") {
    throw new ApiError(400, "Question required");
  }

  const queryEmbedding = await generateEmbedding(question);

  const documents = await Document.find({
    user: req.user._id,
  });

  if (!documents.length) {
    throw new ApiError(404, "No uploaded documents found");
  }

  const scoredChunks = [];

  for (const doc of documents) {
    for (const chunk of doc.chunks) {
      // safety for old mismatched embeddings
      if (queryEmbedding.length !== chunk.embedding.length) {
        continue;
      }

      const score = cosineSimilarity(queryEmbedding, chunk.embedding);

      scoredChunks.push({
        text: chunk.text,
        score,
        fileName: doc.fileName,
      });
    }
  }

  const topChunks = scoredChunks
    .filter((chunk) => chunk.score > 0.45)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (!topChunks.length) {
    throw new ApiError(
      404,
      "I couldn't find enough relevant information in your uploaded document to answer that.",
    );
  }

  const context = topChunks.map((chunk) => chunk.text).join("\n\n");

  const answer = await generateAnswer(context, question);

  let thread;

  if (req.body.threadId) {
    thread = await Thread.findOne({
      _id: req.body.threadId,
      user: req.user._id,
    });

    if (thread) {
      thread.messages.push(
        {
          role: "user",
          content: question,
        },
        {
          role: "assistant",
          content: answer,
        },
      );

      await thread.save();
    }
  } else {
    thread = await Thread.create({
      user: req.user._id,
      title: question.slice(0, 40),
      messages: [
        {
          role: "user",
          content: question,
        },
        {
          role: "assistant",
          content: answer,
        },
      ],
    });
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        answer,
        sources: topChunks.map((chunk) => ({
          fileName: chunk.fileName,
          score: chunk.score,
          preview: chunk.text.slice(0, 150),
        })),
      },
      "Answer generated successfully",
    ),
  );
});
