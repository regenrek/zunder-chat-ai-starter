import OpenAI from "openai";
import { defineEventHandler, readBody } from "h3";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to set this in your .env file
});

export default defineEventHandler(async (event) => {
  try {
    const { messages } = await readBody(event);

    // Ensure messages array is provided
    if (!messages || !Array.isArray(messages)) {
      throw new Error("Invalid messages format");
    }

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages.map((msg) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.content,
      })),
      temperature: 0.7,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Extract the response
    const aiResponse = completion.choices[0].message.content;

    return { response: aiResponse };
  } catch (error) {
    console.error("Error in chat API:", error);
    return { error: "An error occurred while processing your request." };
  }
});
