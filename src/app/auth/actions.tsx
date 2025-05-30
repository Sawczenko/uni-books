"use server";

import {cookies} from "next/headers";
import {users} from "@/db/schema";
import {db} from "@/db";
import {eq} from "drizzle-orm";
import bcrypt from "bcrypt";
import {createSession, generateSessionToken} from "./api";
import {redirect} from "next/navigation";

export const loginAction = async (
    _prev: ActionResult,
    formData: FormData,
): Promise<ActionResult> => {
    try {
        const login = formData.get("username");
        const password = formData.get("password");
        if (typeof login !== "string" || typeof password !== "string") {
            return {
                code: 400,
                message: "Invalid input",
            };
        }

        const user = await db
            .select({id: users.id, passwordHash: users.passwordHash})
            .from(users)
            .where(eq(users.username, login))
            .limit(1)
            .execute();

        if (user.length !== 1) {
            return {
                code: 401,
                message: "Invalid credentials",
            };
        }

        if (!bcrypt.compareSync(password, user[0].passwordHash)) {
            return {
                code: 401,
                message: "Invalid credentials",
            };
        }

        const sessionToken = generateSessionToken();
        const session = await createSession(sessionToken, user[0].id);
        (await cookies()).set("session", sessionToken, {
            expires: session.expiresAt,
        });
    } catch (error) {
        console.error("Error during login action:", error);
        return {
            code: 500,
            message: "Internal server error",
        };
    }
    redirect("/");
};

export const registerAction = async (
    _prev: ActionResult,
    formData: FormData,
): Promise<ActionResult> => {
    try {
        const login = formData.get("username");
        const password = formData.get("password");

        if (typeof login !== "string" || typeof password !== "string") {
            return {
                code: 400,
                message: "Invalid input",
            };
        }

        const existingUser = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.username, login))
            .limit(1)
            .execute();

        if (existingUser.length !== 0) {
            return {
                code: 400,
                message: "Username taken",
            };
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const insertedUsers = await db
            .insert(users)
            .values({
                username: login,
                passwordHash,
            })
            .returning({ id: users.id });

        const newUser = insertedUsers?.[0];

        if (!newUser) {
            return {
                code: 500,
                message: "Failed to create user",
            };
        }

        const sessionToken = generateSessionToken();
        const session = await createSession(sessionToken, newUser.id);

        (await cookies()).set("session", sessionToken, {
            expires: session.expiresAt,
        });

    } catch (error) {
        console.error("Error during registration action:", error);
        return {
            code: 500,
            message: "Internal server error",
        };
    }

    redirect("/");
};

interface ActionResult {
    code: number;
    message?: string;
}
