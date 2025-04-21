import { useState } from "react";
import axios from "axios";

type Props = {
  onAuthSuccess: (token: string) => void;
};

export default function Auth({ onAuthSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");

  const handleAuth = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/auth/${mode}`,
        { email, password }
      );
      onAuthSuccess(res.data.token);
      localStorage.setItem("cluely_token", res.data.token);
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto text-center space-y-4">
      <h2 className="text-2xl font-semibold">{mode === "login" ? "Log In" : "Sign Up"}</h2>

      <input
        className="border p-2 rounded w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="border p-2 rounded w-full"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleAuth}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
      >
        {mode === "login" ? "Log In" : "Sign Up"}
      </button>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <p className="text-sm">
        {mode === "login" ? "New here?" : "Already have an account?"}{" "}
        <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="underline text-blue-600">
          {mode === "login" ? "Sign up" : "Log in"}
        </button>
      </p>
    </div>
  );
}
