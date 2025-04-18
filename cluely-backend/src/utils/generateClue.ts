import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateClue(userGuess: string, targetWord: string): Promise<string> {
  const prompt = `You are a clever riddle master in a daily guessing game. The target word is "${targetWord}", but the user guessed "${userGuess}". Give them a subtle, clever clue that nudges them toward the right answer without revealing it. The clue should be challenging and it should not be straightforward to guess it. Make it fun and engaging, such that users are hooked to this riddle game."`;
  const response = await openai.chat.completions.create({
    model: "gpt-4o", // ← updated model
    messages: [
      { role: "system", content: "You are a witty and clever riddle-giver." },
      { role: "user", content: prompt },
    ],
  });

  return response.choices[0].message.content?.trim() || "Cluely is scratching its head... 🤔 Try again?";
}
