import { useState } from "react";
import axios from "axios";
import Summary from "./Summary";
import Leaderboard from "./Leaderboard";

type Props = {
    token: string;
  };

export default function Game({ token }: Props) {
  const [guess, setGuess] = useState("");
  const [clue, setClue] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  
  const submitGuess = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/guess",
        { guess },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setClue(res.data.clue || "");
      setAttemptsLeft(res.data.attemptsLeft);
      setMessage(res.data.message);
      setGuess("");

      if (res.data.correct || res.data.attemptsLeft === 0) {
        setGameOver(true);
      }

    } catch (err: any) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    }
  };

  if (gameOver) {
    return (
      <div className="space-y-6">
        <Summary token={token} />
        <Leaderboard />
      </div>
    );
  }  //Return summary component if game is over

  // If game is not over, show the game interface
  return (
    <div className="p-4 max-w-xl mx-auto text-center space-y-4">
      <h1 className="text-3xl font-bold">🧠 Cluely</h1>
      <p>Guess the secret word! You have {attemptsLeft} attempts.</p>

      <input
        className="border p-2 rounded w-full"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Enter your guess..."
      />

      <button
        onClick={submitGuess}
        disabled={!guess.trim()}
        className={`px-4 py-2 rounded transition-all duration-200 ${
          !guess.trim()
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        Submit Guess
      </button>

      {clue && <p className="italic text-yellow-700">Clue: {clue}</p>}
      {message && <p className="font-bold">{message}</p>}
    </div>
  );
}
