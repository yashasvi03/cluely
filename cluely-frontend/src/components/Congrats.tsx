import { motion } from "framer-motion";
import { Button } from "./ui/button";

type Props = {
  onRestart?: () => void;
};

export default function Congrats({ onRestart }: Props) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-4xl font-extrabold text-green-600 dark:text-green-400"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        🎉 Congratulations!
      </motion.h1>

      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md">
        You solved today’s puzzle. Come back tomorrow to keep your streak alive!
      </p>

      <Button
        variant="outline"
        onClick={onRestart}
        className="hover:bg-green-100 dark:hover:bg-green-900 transition"
      >
        Play Again Tomorrow
      </Button>
    </motion.div>
  );
}
