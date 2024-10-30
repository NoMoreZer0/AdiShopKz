import connectToDatabase from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import User from "@/models/User";

export async function GET(request) {
    await connectToDatabase()
    
    const sessionCookie = request.cookies.get("session")?.value;
    if (!sessionCookie) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const session = await decrypt(sessionCookie);
    if (!session || !session.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const user = await User.findById(session.userId).lean()
    return NextResponse.json({ user });
}

export async function PUT(request) {
    await connectToDatabase();

    const sessionCookie = request.cookies.get("session")?.value;
    if (!sessionCookie) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const session = await decrypt(sessionCookie);
    if (!session || !session.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { name, email, phoneNumber, deliveryAddress } = await request.json();
    try {
        const updatedUser = await User.findByIdAndUpdate(
            session.userId,
            { name, email, phoneNumber, deliveryAddress},
            { new: true }
        );
        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}