import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { AuthPayload } from './types';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);
const ONE_DAY = 24 * 60 * 60 * 1000;

export async function createSession(user: AuthPayload): Promise<AuthPayload> {
  const payload: AuthPayload = {
    id: user.id,
    username: user.username,
    fullname: user.fullname,
  };

  // Create JWT
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + ONE_DAY * 7),
    sameSite: "lax",
    path: "/",
  });

  return payload;
}

export async function verifySession(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    });

    return payload as AuthPayload;
  } catch {
    return null;
  }
}
export async function deleteSession() {
  const cookie = await cookies()
  cookie.delete('session');
}

export async function getAuthUser(): Promise<AuthPayload | null> {
  const user = await verifySession();
  return user
}