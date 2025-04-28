import { motion } from "framer-motion";
import { Button } from "./ui/button";

export default function GameOver({ answer }: { answer: string }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-4xl font-extrabold text-red-600 dark:text-red-400"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        😞 Game Over
      </motion.h1>

      <p className="text-lg text-gray-600 dark:text-gray-300">
        You used all your attempts. Today's answer was:
      </p>

      <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900 px-4 py-2 rounded-lg">
        {answer}
      </div>

      <Button variant="secondary" onClick={() => window.location.reload()}>
        Try Again Tomorrow
      </Button>
    </motion.div>
  );
}
