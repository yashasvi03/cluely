import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//import { users } from "../data/users";
import { prisma } from "../utils/prisma";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "cluely-secret";

router.post("/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: "Email and password required." });

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return res.status(400).json({ error: "User already exists." });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "7d" });

  return res.status(201).json({ token });
});


router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: "User not found." });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials." });

  const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "7d" });

  return res.json({ token });
});


export default router;
