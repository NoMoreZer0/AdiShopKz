import Product from '@/models/Product';

function tokenize(text) {
    return text ? text.toLowerCase().match(/\w+/g) || [] : [];
}

export async function getProductFeatures() {
    const products = await Product.find();
    return products.map(product => ({
        id: product._id.toString(),
        content:  tokenize(`${product.name} ${product.description} ${product.category}`),
    }));
}