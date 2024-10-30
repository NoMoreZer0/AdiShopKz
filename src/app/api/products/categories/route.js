import Product from "@/models/Product";
import connectToDatabase from "@/lib/mongodb";

export async function GET() {
    await connectToDatabase();

    try {
        const categories = await Product.distinct("category");
        return new Response(JSON.stringify(categories), { status: 200 });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch categories" }), { status: 500 });
    }
}
