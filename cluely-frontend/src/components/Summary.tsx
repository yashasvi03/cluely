import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";

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
      try {
        const res = await axios.get("http://localhost:3000/api/summary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(res.data);
      } catch (err) {
        toast.error("Failed to fetch game summary.");
      }
    };

    fetchSummary();
  }, [token]);

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary.result);
      toast.success("Copied to clipboard!", {
        description: "Your Cluely result is ready to share.",
      });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!summary) return <p className="text-center text-gray-500">Loading summary...</p>;

  return (
    <motion.div
      className="max-w-xl mx-auto py-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border border-purple-300 dark:border-purple-600 shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-purple-700 dark:text-purple-300">
            🧾 Cluely Summary
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <p className="text-3xl font-mono animate-pulse">{summary.result}</p>

          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <p>
              Attempts:{" "}
              <span className="font-semibold text-purple-700 dark:text-purple-300">
                {summary.attempts}
              </span>
            </p>
            <p>
              Streak:{" "}
              <span className="font-semibold text-green-600 dark:text-green-300">
                {summary.streak}
              </span>
            </p>
          </div>

          <Button onClick={handleCopy} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            📤 Share My Result
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
