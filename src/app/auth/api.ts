import type {Session, User} from "@/db/schema";
import {sessions, users} from "@/db/schema";
import {db} from "@/db";
import {eq} from "drizzle-orm";
import {encodeBase32LowerCaseNoPadding, encodeHexLowerCase,} from "@oslojs/encoding";
import {sha256} from "@oslojs/crypto/sha2";
import {NextApiResponse} from "next";

export async function createSession(
    token: string,
    userId: number,
): Promise<Session> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: Session = {
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    };
    await db.insert(sessions).values(session);
    return session;
}

export async function validateSessionToken(
    token: string,
): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const result = await db
        .select({user: users, session: sessions})
        .from(sessions)
        .innerJoin(users, eq(sessions.userId, users.id))
        .where(eq(sessions.id, sessionId));
    if (result.length < 1) {
        return {session: null, user: null};
    }
    const {user, session} = result[0];
    if (Date.now() >= session.expiresAt.getTime()) {
        await db.delete(sessions).where(eq(sessions.id, session.id));
        return {session: null, user: null};
    }
    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
        session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        await db
            .update(sessions)
            .set({
                expiresAt: session.expiresAt,
            })
            .where(eq(sessions.id, session.id));
    }
    return {session, user};
}

export async function invalidateSession(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function invalidateAllSessions(userId: number): Promise<void> {
    await db.delete(sessions).where(eq(sessions.userId, userId));
}

export type SessionValidationResult =
    | { session: Session; user: User }
    | { session: null; user: null };

export function generateSessionToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
}

export function setSessionTokenCookie(
    response: NextApiResponse,
    token: string,
    expiresAt: Date,
): void {
    response.setHeaders(
        new Map([
            [
                "Set-Cookie",
                `session=${token}; HttpOnly; SameSite=Lax; Expires=${expiresAt.toUTCString()}; Path=/`,
            ],
        ]),
    );
}

export function deleteSessionTokenCookie(response: NextApiResponse): void {
    response.setHeaders(
        new Map([
            ["Set-Cookie", "session=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/"],
        ]),
    );
}
