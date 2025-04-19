import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "cluely-secret";

// export function authenticate(req: Request, res: Response, next: NextFunction) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) return res.status(401).json({ error: "Missing token." });

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
//     req.body.userEmail = decoded.email;
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Invalid token." });
//   }
// }

declare global {
  namespace Express {
    interface Request {
      user?: { email: string };
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing token." });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    req.user = { email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token." });
  }
}
