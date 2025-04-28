import { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-xl mx-auto space-y-4 transition-all duration-300">
      {children}
    </div>
  );
}
