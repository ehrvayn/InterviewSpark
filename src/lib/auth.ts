import jwt from "jsonwebtoken";

export interface AuthUser {
  userId: number;
  email: string;
  name: string;
  credit: number;
}

export const AUTH_COOKIE = "token";

export function getAuthUser(req: Request): AuthUser | null {
  const authHeader = req.headers.get("authorization");
  let token: string | undefined;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(new RegExp(`(?:^|; )${AUTH_COOKIE}=([^;]*)`));
    if (match) token = decodeURIComponent(match[1]);
  }

  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as AuthUser;
  } catch {
    return null;
  }
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}



