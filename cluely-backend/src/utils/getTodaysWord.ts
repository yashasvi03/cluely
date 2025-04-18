import wordList from "../data/wordList";

export function getTodaysWord(): string {
  const today = new Date();
  const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24)); // Days since epoch
  return wordList[dayIndex % wordList.length];
}
