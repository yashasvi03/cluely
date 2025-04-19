import { Router, Request, Response } from "express";
import { generateClue } from "../utils/generateClue";
import { getTodaysWord } from "../utils/getTodaysWord";
import { authenticate } from "../middleware/authMiddleware";
//import { users } from "../data/users";
import { prisma } from "../utils/prisma";

const router = Router();

// Get today's word from Wordlist
const todayWord = getTodaysWord(); 

// Basic IP-based session store
const gameSessions: Record<string, string[]> = {};

router.post("/guess", authenticate, async (req: Request, res: Response) => {
  const email = req.body.userEmail;
  const { guess } = req.body;
  const todayWord = getTodaysWord();
  const today = new Date().toISOString().split("T")[0];

  if (!guess || typeof guess !== "string") {
    return res.status(400).json({ error: "Guess must be a string." });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found." });

  // If it's a new day, reset guesses
  const lastPlayed = user.lastPlayed?.toISOString().split("T")[0];
  const isNewDay = lastPlayed !== today;

  if (isNewDay) {
    await prisma.user.update({
      where: { email },
      data: {
        lastPlayed: new Date(),
        guesses: {
          deleteMany: {}, // Clear old guesses for demo purposes
        },
      },
    });
  }

  // Count guesses today
  const todayStart = new Date(today + "T00:00:00.000Z");
  const guessCount = await prisma.guess.count({
    where: {
      userId: user.id,
      createdAt: { gte: todayStart },
    },
  });

  if (guessCount >= 5) {
    return res.status(403).json({ message: "You've used all attempts for today!" });
  }

  const normalized = guess.trim().toLowerCase();

  // Save guess to DB
  await prisma.guess.create({
    data: {
      userId: user.id,
      word: normalized,
    },
  });

  const isCorrect = normalized === todayWord;

  // Update streak
  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      streak: isCorrect
        ? user.streak + 1
        : guessCount + 1 >= 5
        ? 0
        : user.streak,
    },
  });

  const clue = isCorrect ? null : await generateClue(normalized, todayWord);

  return res.json({
    correct: isCorrect,
    attemptsLeft: 4 - guessCount, // Already added this guess
    clue,
    streak: updatedUser.streak,
    message: isCorrect ? "🎉 You got it!" : "❌ Not quite, try again!",
  });
});


export default router;
