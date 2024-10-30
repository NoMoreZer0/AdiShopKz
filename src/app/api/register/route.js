import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/utils/auth";

export async function POST(request) {
    try {
        await connectToDatabase(); // Ensure MongoDB connection

        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return new Response(
                JSON.stringify({ error: "Name, email, and password are required" }),
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new Response(
                JSON.stringify({ error: "User already exists with this email" }),
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(password);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        return new Response(
            JSON.stringify({ message: "User registered successfully" }),
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: "Error registering user" }),
            { status: 500 }
        );
    }
}
