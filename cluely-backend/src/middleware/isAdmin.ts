import { Request, Response, NextFunction } from "express";

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const email = req.user?.email;

  if (!email || !email.endsWith("@cluely.admin")) {
    return res.status(403).json({ error: "Admins only." });
  }

  next();
}
