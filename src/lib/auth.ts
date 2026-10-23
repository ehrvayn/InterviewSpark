import jwt from "jsonwebtoken";

export interface AuthUser {
  userId: number;
  email: string;
  name: string;
  credit: number;
}

export function getAuthUser(req: Request): AuthUser | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
}