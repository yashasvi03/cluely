import { useEffect, useState } from "react";
import Auth from "./components/Auth";
import Game from "./components/Game";

function App() {
  const [token, setToken] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Check localStorage for token and dark mode on load
  useEffect(() => {
    const storedToken = localStorage.getItem("cluely_token");
    if (storedToken) setToken(storedToken);

    const savedDark = localStorage.getItem("cluely_dark");
    if (savedDark === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("cluely_token");
    setToken("");
  };

  const toggleDark = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("cluely_dark", String(newMode));
    document.documentElement.classList.toggle("dark", newMode);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-start">
      <div className="flex justify-between items-center max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-300">🧠 Cluely</h1>

        {token && (
          <div className="flex gap-4 items-center">
            <button
              onClick={toggleDark}
              className="text-sm underline text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 underline hover:text-red-800"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-4xl px-4 py-6">
        {token ? <Game token={token} /> : <Auth onAuthSuccess={setToken} />}
      </div>
    </div>
  );
}

export default App;
