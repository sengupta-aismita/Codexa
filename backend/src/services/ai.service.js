import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",

  apiKey: process.env.OPENROUTER_API_KEY,
});

const SYSTEM_PROMPT = `
You are Codexa, an AI coding tutor.

You ONLY help with:
- DSA
- Java
- DBMS
- C Programming
- Interview Preparation
- Web Development
- Python
- C++

Explain concepts step-by-step.
Use beginner-friendly examples.
`;

export const generateChatResponse = async (messages) => {
  const completion = await client.chat.completions.create({
    model: "deepseek/deepseek-chat",

    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },

      ...messages,
    ],
  });

  return completion.choices[0].message.content;
};
