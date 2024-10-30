import clientPromise from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(request) {
    try {
        const { userId, phoneNumber, deliveryAddress } = await request.json();

        if (!userId) {
            return new Response(
                JSON.stringify({ error: "User ID is required" }),
                { status: 400 }
            );
        }

        const client = await clientPromise;
        await client.db(); 
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { phoneNumber, deliveryAddress },
            { new: true }
        );

        return new Response(
            JSON.stringify({ message: "Profile updated successfully", user: updatedUser }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: "Error updating profile" }),
            { status: 500 }
        );
    }
}
