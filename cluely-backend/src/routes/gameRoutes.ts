import { Router, Request, Response } from "express";
import { generateClue } from "../utils/generateClue";
import { getTodaysWord } from "../utils/getTodaysWord";
import { authenticate } from "../middleware/authMiddleware";
import { users } from "../data/users";


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

  const user = users[email];
  if (!user) return res.status(404).json({ error: "User not found." });

  // Reset if new day
  if (user.lastPlayed !== today) {
    user.lastPlayed = today;
    user.guessesToday = [];
  }

  if (user.guessesToday.length >= 5) {
    return res.status(403).json({ message: "You've used all attempts for today!" });
  }

  const normalized = guess.trim().toLowerCase();
  user.guessesToday.push(normalized);
  const isCorrect = normalized === todayWord;

  if (isCorrect) user.streak += 1;
  else if (user.guessesToday.length >= 5) user.streak = 0;

  const clue = isCorrect ? null : await generateClue(normalized, todayWord);

  return res.json({
    correct: isCorrect,
    attemptsLeft: 5 - user.guessesToday.length,
    clue,
    streak: user.streak,
    message: isCorrect ? "🎉 You got it!" : "❌ Not quite, try again!",
  });
});


export default router;
