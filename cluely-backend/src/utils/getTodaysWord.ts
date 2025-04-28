import { prisma } from "../utils/prisma";
import wordList from "../data/wordList";

export async function getTodaysWord(): Promise<string> {
  const today = new Date();
  const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // 1. Check if scheduled word exists in DB
  const scheduledWord = await prisma.dailyWord.findUnique({
    where: { date: dateOnly },
  });

  if (scheduledWord) {
    return scheduledWord.word.toLowerCase();
  }

  // 2. Fallback to basic logic (wordList array)
  const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24)); // Days since epoch
  return wordList[dayIndex % wordList.length].toLowerCase();
}
