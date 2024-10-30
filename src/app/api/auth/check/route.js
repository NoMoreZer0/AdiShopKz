import { NextResponse } from "next/server";
import { decrypt } from "@/lib/session"; 

export async function GET(request) {
    const sessionCookie = request.cookies.get("session")?.value;

    if (!sessionCookie) {
        return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    try {
        const session = await decrypt(sessionCookie);
        if (session && session.userId) {
            return NextResponse.json({ authenticated: true }, { status: 200 });
        }
    } catch (error) {
        console.error("Error verifying session:", error);
    }

    return NextResponse.json({ authenticated: false }, { status: 200 });
}
