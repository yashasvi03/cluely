import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

type WordEntry = {
  id: string;
  date: string;
  word: string;
};

export default function Admin() {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [word, setWord] = useState("");
  const [date, setDate] = useState("");
  const [todayWord, setTodayWord] = useState<string | null>(null);
  const [loadingTodayWord, setLoadingTodayWord] = useState(false);

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/words", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("cluely_token")}`,
        },
      });
      setWords(res.data.words);
    } catch (err) {
      toast.error("Failed to fetch words.");
    }
  };

  const addWord = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/admin/words",
        { word, date },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("cluely_token")}`,
          },
        }
      );
      setWord("");
      setDate("");
      fetchWords();
      toast.success("Word scheduled successfully!");
    } catch (err) {
      toast.error("Failed to add word.");
    }
  };


  const updateWordLocally = (id: string, newWord: string) => {
    setWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, word: newWord } : w))
    );
  };
  
  const saveWord = async (id: string, newWord: string) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/admin/words/${id}`,
        { word: newWord },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("cluely_token")}` },
        }
      );
      toast.success("Word updated!");
      fetchWords();
    } catch (err) {
      toast.error("Failed to update word.");
    }
  };
  
  const deleteWord = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/words/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("cluely_token")}` },
      });
      toast.success("Word deleted!");
      fetchWords();
    } catch (err) {
      toast.error("Failed to delete word.");
    }
  };
  
  const fetchTodayWord = async () => {
    try {
      setLoadingTodayWord(true);
      const res = await axios.get("http://localhost:3000/api/admin/today-word", {
        headers: { Authorization: `Bearer ${localStorage.getItem("cluely_token")}` },
      });
      setTodayWord(res.data.word);
    } catch (err) {
      toast.error("Failed to fetch today's word.");
    } finally {
      setLoadingTodayWord(false);
    }
  };
  


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <Card className="shadow-xl border border-purple-300 dark:border-purple-600">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-purple-700 dark:text-purple-300">
              🛠️ Cluely Admin Panel
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              placeholder="Word of the Day"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className="text-lg"
            />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-lg"
            />
            <Button onClick={addWord} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              ➕ Schedule Word
            </Button>
          </CardContent>
        </Card>
        <Card className="shadow border border-purple-300 dark:border-purple-600">
            <CardHeader>
                <CardTitle className="text-lg text-center">👀 Today's Word Status</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center space-y-4">
                {todayWord ? (
                <>
                    <p className="text-xl font-bold text-purple-700 dark:text-purple-300">
                    {todayWord.toUpperCase()}
                    </p>
                    <Button variant="outline" onClick={() => setTodayWord(null)}>
                    🔄 Clear
                    </Button>
                </>
                ) : (
                <Button
                    onClick={fetchTodayWord}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {loadingTodayWord ? "Loading..." : "🔍 Preview Today's Word"}
                  </Button>
                )}
            </CardContent>
        </Card>

        <Card className="shadow border border-purple-300 dark:border-purple-600">
          <CardHeader>
            <CardTitle className="text-lg text-center">📅 Scheduled Words</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            {words.length > 0 ? (
              words.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-2 border-b border-gray-300 dark:border-gray-700 py-1"
                >
                  <span className="text-purple-600 dark:text-purple-300">{new Date(entry.date).toDateString()}</span>
              
                  <input
                    value={entry.word}
                    onChange={(e) => updateWordLocally(entry.id, e.target.value)}
                    className="border rounded-md p-1 w-32 bg-white dark:bg-gray-800 text-sm"
                  />
              
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => saveWord(entry.id, entry.word)}>
                      💾
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteWord(entry.id)}>
                      🗑️
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No words scheduled yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
