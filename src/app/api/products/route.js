import Product from "@/models/Product";
import connectToDatabase from "@/lib/mongodb";

export async function GET(request) {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const category = searchParams.get("category") || "";
    const productId = searchParams.get("id");
    const page = parseInt(searchParams.get("page", 10)) || 1;
    const limit = parseInt(searchParams.get("limit"), 10) || 10;

    let filter = {}

    if (query) {
        filter.$text = { $search: query };
    }

    if (category) {
        filter.category = category
    }

    try {
        if (productId) {
            const product = await Product.findById(productId);
            if (!product) {
                return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
            }
            return new Response(JSON.stringify(product), { status: 200 });
        } else {
            const products = await Product.find(filter).skip((page - 1) * limit).limit(limit);
            const totalProducts = await Product.countDocuments(filter);
            return new Response(
                JSON.stringify({
                    "products": products,
                    "totalPages": Math.ceil(totalProducts / limit),
                    "currentPage": page
                }), 
                { status: 200 }
            );
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch products" }), { status: 500 });
    }
}
