import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Logged out" });
    response.cookies.set("session", "", {
        httpOnly: true,
        secure: true,
        maxAge: -1,
        path: "/",
    });
    return response;
}
