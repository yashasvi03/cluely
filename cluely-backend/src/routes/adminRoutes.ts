import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/isAdmin";
import { prisma } from "../utils/prisma";
import { getTodaysWord } from "../utils/getTodaysWord";

const router = Router();

router.get("/words", authenticate, isAdmin, async (req: Request, res: Response) => {
  const words = await prisma.dailyWord.findMany({ orderBy: { date: "asc" } });
  res.json({ words });
});

router.post("/words", authenticate, isAdmin, async (req: Request, res: Response) => {
  const { word, date } = req.body;
  if (!word || !date) return res.status(400).json({ error: "Word and date required." });

  const parsedDate = new Date(date);
  const newWord = await prisma.dailyWord.upsert({
    where: { date: parsedDate },
    update: { word },
    create: { word, date: parsedDate },
  });

  res.json({ success: true, word: newWord });
});

// DELETE /api/admin/words/:id
router.delete("/words/:id", authenticate, isAdmin, async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.dailyWord.delete({ where: { id } });
    res.json({ success: true });
  });
  
  // PATCH /api/admin/words/:id
  router.patch("/words/:id", authenticate, isAdmin, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { word } = req.body;
  
    if (!word) return res.status(400).json({ error: "Word is required." });
  
    const updated = await prisma.dailyWord.update({
      where: { id },
      data: { word },
    });
  
    res.json({ success: true, updated });
  });
  
  router.get("/today-word", authenticate, isAdmin, async (req: Request, res: Response) => {
    const todayWord = await getTodaysWord();
    res.json({ word: todayWord });
  });

export default router;
