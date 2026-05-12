import Thread from "../models/thread.models.js";
import { generateChatResponse } from "../services/ai.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

export const generateAIResponse = asyncHandler(async (req, res) => {
  const { threadId, message } = req.body;
  if (!message) {
    throw new ApiError(400, "Message is required");
  }
  let thread;
  if (threadId) {
    thread = await Thread.findById(threadId);

    if (!thread) {
      throw new ApiError(404, "Thread not found");
    }
  } else {
    thread = await Thread.create({
      user: req.user._id,
      title: message.slice(0, 30),
      messages: [],
    });
  }

  thread.messages.push({
    role: "user",
    content: message,
  });

  const aiReply = await generateChatResponse(thread.messages);

  thread.messages.push({
    role: "assistant",
    content: aiReply,
  });

  await thread.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        threadId: thread._id,
        reply: aiReply,
        messages: thread.messages,
      },
      "Ai response generated",
    ),
  );
});

export const getThreads = asyncHandler(async (req, res) => {
  const threads = await Thread.find({
    user: req.user._id,
  }).sort({ updatedAt: -1 });

  return res.status(200).json(new ApiResponse(200, threads, "Threads fetched"));
});

export const getSingleThread = asyncHandler(async (req, res) => {
  const { threadId } = req.params;

  const thread = await Thread.findOne({
    _id: threadId,

    user: req.user._id,
  });

  if (!thread) {
    throw new ApiError(404, "Thread not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, thread, "Thread fetched successfully"));
});

export const deleteThread = asyncHandler(async (req, res) => {
  const { threadId } = req.params;

  const thread = await Thread.findOneAndDelete({
    _id: threadId,

    user: req.user._id,
  });

  if (!thread) {
    throw new ApiError(404, "Thread not found");
  }

  if (thread.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Thread deleted successfully"));
});
