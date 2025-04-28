import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type LeaderboardEntry = {
  rank: number;
  email: string;
  streak: number;
};

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/leaderboard")
      .then((res) => setEntries(res.data.leaderboard))
      .catch(() => {});
  }, []);

  return (
    <Card className="shadow border border-purple-300 dark:border-purple-600">
      <CardHeader>
        <CardTitle className="text-center text-lg">🏆 Top Streaks</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li
              key={entry.rank}
              className="flex justify-between items-center text-sm border-b pb-1 border-gray-200 dark:border-gray-700"
            >
              <span className="font-mono w-5 text-gray-500">{entry.rank}</span>
              <span className="truncate">{entry.email}</span>
              <span className="text-purple-700 dark:text-purple-300 font-semibold">
                🔥 {entry.streak}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
