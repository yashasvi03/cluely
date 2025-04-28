import { Router, Request, Response } from "express";
import { generateClue } from "../utils/generateClue";
import { getTodaysWord } from "../utils/getTodaysWord";
import { authenticate } from "../middleware/authMiddleware";
//import { users } from "../data/users";
import { prisma } from "../utils/prisma";

const router = Router();

// Basic IP-based session store
const gameSessions: Record<string, string[]> = {};

router.post("/guess", authenticate, async (req: Request, res: Response) => {
  const email = req.user?.email;
  const { guess } = req.body;
  const todayWord = await getTodaysWord();
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
    ...( !isCorrect && guessCount + 1 >= 5 ? { answer: todayWord } : {} )
  });
});


router.get("/summary", authenticate, async (req: Request, res: Response) => {
  const email = req.user?.email;
  const today = new Date().toISOString().split("T")[0];
  const todayWord = await getTodaysWord();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found." });

  const todayStart = new Date(today + "T00:00:00.000Z");

  const guesses = await prisma.guess.findMany({
    where: {
      userId: user.id,
      createdAt: { gte: todayStart },
    },
    orderBy: { createdAt: "asc" },
  });

  // Generate emoji summary (basic logic)
  const summary = guesses.map((g) => {
    if (g.word === todayWord) return "🟩";
    if (g.word.length === todayWord.length) return "🟨";
    return "⬛";
  }).join("");

  const resultText = `Cluely ${summary.length}/5\n${summary}`;

  return res.json({
    guesses: guesses.map((g) => g.word),
    result: resultText,
    correct: guesses.some((g) => g.word === todayWord),
    attempts: guesses.length,
    streak: user.streak,
  });
});


router.get("/leaderboard", async (req: Request, res: Response) => {
  const topUsers = await prisma.user.findMany({
    orderBy: { streak: "desc" },
    take: 10,
    select: {
      email: true,
      streak: true,
    },
  });

  const leaderboard = topUsers.map((user, index) => ({
    rank: index + 1,
    email: maskEmail(user.email),
    streak: user.streak,
  }));

  res.json({ leaderboard });
});

// Helper to mask email (privacy)
function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  return name[0] + "***@" + domain;
}



export default router;
