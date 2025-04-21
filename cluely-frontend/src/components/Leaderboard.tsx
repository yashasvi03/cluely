import { useEffect, useState } from "react";
import axios from "axios";

type LeaderboardEntry = {
  rank: number;
  email: string;
  streak: number;
};

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/leaderboard");
        setEntries(res.data.leaderboard);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <p className="text-center">Loading leaderboard...</p>;

  return (
    <div className="bg-white rounded-lg p-4 shadow max-w-xl mx-auto text-center mt-6 space-y-4">
      <h2 className="text-xl font-bold">🏆 Leaderboard</h2>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="p-2 border-b">Rank</th>
            <th className="p-2 border-b">Player</th>
            <th className="p-2 border-b text-right">Streak 🔥</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.rank} className="hover:bg-purple-50 transition">
              <td className="p-2">{entry.rank}</td>
              <td className="p-2">{entry.email}</td>
              <td className="p-2 text-right">{entry.streak}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
