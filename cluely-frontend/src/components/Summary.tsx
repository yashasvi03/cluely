import { useEffect, useState } from "react";
import axios from "axios";

type Props = {
  token: string;
};

type Summary = {
  result: string;
  guesses: string[];
  correct: boolean;
  attempts: number;
  streak: number;
};

export default function Summary({ token }: Props) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await axios.get("http://localhost:3000/api/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data);
    };

    fetchSummary();
  }, [token]);

  const copyToClipboard = () => {
    if (summary) {
      navigator.clipboard.writeText(summary.result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!summary) return <p className="text-center">Loading summary...</p>;

  return (
    <div className="bg-white rounded-lg p-4 shadow max-w-xl mx-auto text-center mt-4 space-y-4">
      <h2 className="text-xl font-bold">🧾 Your Cluely Summary</h2>
      <p className="text-2xl animate-pulse">{summary.result}</p>
      <p className="text-sm text-gray-500">Streak: {summary.streak}</p>

      <button
        onClick={copyToClipboard}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        {copied ? "✅ Copied!" : "📤 Share Result"}
      </button>
    </div>
  );
}
