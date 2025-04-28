import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.tsx";
import { Input } from "./ui/input.tsx";
import { Button } from "./ui/button.tsx";
import { Badge } from "./ui/badge.tsx";
import { toast } from "sonner";
import Congrats from "./Congrats.tsx";
import Summary from "./Summary";
import Leaderboard from "./Leaderboard";
import GameOver from "./GameOver.tsx";

type Props = {
  token: string;
};

export default function Game({ token }: Props) {
  const [guess, setGuess] = useState("");
  const [clue, setClue] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [showStartingHint, setShowStartingHint] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [correctWord, setCorrectWord] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStartingHint(true);
    }, 1000); // delay hint reveal for UX
  
    return () => clearTimeout(timer);
  }, []);

  const submitGuess = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/guess",
        { guess },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClue(res.data.clue || "");
      setAttemptsLeft(res.data.attemptsLeft);
      setMessage(res.data.message);
      setGuess("");

      if (res.data.correct) {
        toast.success("🎉 You solved it!", {
          description: "Come back tomorrow for a new puzzle.",
        });
        setGameOver(true);
        setCorrect(true);
        setCorrectWord(guess);
      } else if (res.data.attemptsLeft === 0) {
        toast.error("🛑 Game Over", {
          description: "You've used all your attempts.",
        });
        setGameOver(true);
        setCorrect(false);
        setCorrectWord(res.data.answer); // Assuming the API returns the correct word
      }
    } catch (err: any) {
      toast.error("Something went wrong", {
        description: err.response?.data?.message || "Try again later.",
      });
    }
  };


  if (gameOver) {
    if (correct) {
      return (
        <>
          <Congrats />
          <Summary token={token} />
        </>
      );
    } else {
      return <GameOver answer={correctWord} />;
    }
  }

  
  return (
    <div className="flex flex-col lg:flex-row gap-6 justify-center items-start px-4 max-w-6xl mx-auto py-8">
      {/* Game Section */}
      <Card className="w-full lg:w-2/3 shadow-xl border border-purple-300 dark:border-purple-500">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-purple-700 dark:text-purple-300">
            🧠 Cluely – Daily Puzzle
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
        {/* 💡 Starting Hint */}
        {showStartingHint && !clue && (
          <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 p-3 rounded-md border border-blue-300 dark:border-blue-600 text-sm text-center animate-fadeIn">
            💡 Hint to start: Think of a word that’s scientific, physical, or cosmic.
          </div>
        )}

          <div className="space-y-2">
            <Input
              placeholder="Enter your guess..."
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="text-lg px-4 py-3"
            />

            <Button
              onClick={submitGuess}
              disabled={!guess.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-2"
            >
              Submit Guess
            </Button>
          </div>

          {clue && (
            <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 p-4 rounded-lg animate-fadeIn border border-yellow-400">
              <p className="italic text-center font-medium">Clue: {clue}</p>
            </div>
          )}

          {message && (
            <div className="text-center text-lg font-semibold animate-pulse">
              {message}
            </div>
          )}

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Attempts Left:{" "}
            <Badge className="bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-100 text-sm px-3 py-1">
              {attemptsLeft}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <div className="w-full lg:w-1/3">
        <Leaderboard />
      </div>
    </div>
  );
}
