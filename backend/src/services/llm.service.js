import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateAnswer = async (context, question) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "Answer ONLY using the provided context. If insufficient context exists, clearly say so.",
      },
      {
        role: "user",
        content: `
Context:
${context}

Question:
${question}
        `,
      },
    ],
  });

  return completion.choices[0].message.content;
};