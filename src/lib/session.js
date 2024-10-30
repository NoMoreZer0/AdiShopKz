import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const secretKey = process.env.JWT_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function createSession(userId) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await encrypt({ userId, expiresAt })

    await cookies().set("session", session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt
    })
}

export async function deleteSession() {
    cookies().delete("session")
}

export async function encrypt(payload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(encodedKey)
}

export async function decrypt(session = "") {
   try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ["HS256"]
        })
        return payload
    } catch (error) {
        console.log("Failed to verify session")
    }
}

export async function getSessionUserId() {
    try {
        const allCookies = await cookies();
        const cookie = allCookies.get("session")?.value
        const session = await decrypt(cookie)
        return session.userId || null;
    } catch (error) {
        console.error("Failed to verify session token:", error);
        return null;
    }
}
