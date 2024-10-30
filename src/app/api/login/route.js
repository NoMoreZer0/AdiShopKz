import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { comparePassword } from "@/utils/auth";
import { createSession } from "@/lib/session";

export async function POST(request) {
    try {
        await connectToDatabase(); 
        const { email, password } = await request.json();

        if (!email || !password) {
            return new Response(
                JSON.stringify({ error: "Email and password are required" }),
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        if (!user || !(await comparePassword(password, user.password))) {
            return new Response(
                JSON.stringify({ error: "Invalid email or password" }),
                { status: 401 }
            );
        }

        await createSession(user._id)

        return new Response("", {status: 200});
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: "Error logging in" }),
            { status: 500 }
        );
    }
}
