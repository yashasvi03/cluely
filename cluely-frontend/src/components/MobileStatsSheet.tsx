import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
  } from "./ui/sheet";
  import { Button } from "./ui/button";
  import Leaderboard from "./Leaderboard";
  
  export default function MobileStatsSheet() {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="fixed bottom-6 right-6 z-50 bg-white dark:bg-black border shadow-lg">
            📊 Stats
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[75vh] overflow-auto">
          <SheetHeader>
            <SheetTitle>Game Stats</SheetTitle>
          </SheetHeader>
          <Leaderboard />
        </SheetContent>
      </Sheet>
    );
  }
  