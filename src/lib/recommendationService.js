import { getProductFeatures } from './productFeaturesService';

function calculateCosineSimilarity(tokensA, tokensB) {
    tokensA = Array.isArray(tokensA) ? tokensA : [];
    tokensB = Array.isArray(tokensB) ? tokensB : [];

    const tokenSet = new Set([...tokensA, ...tokensB]);
    const vectorA = Array.from(tokenSet).map((token) => tokensA.includes(token) ? 1 : 0);
    const vectorB = Array.from(tokenSet).map((token) => tokensB.includes(token) ? 1 : 0);

    const dotProduct = vectorA.reduce((sum, value, index) => sum + value * vectorB[index], 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, value) => sum + value ** 2, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, value) => sum + value ** 2, 0));

    return dotProduct / (magnitudeA * magnitudeB || 1);
}


export async function generateRecommendations(productId) {
    const products = await getProductFeatures();
    const targetProduct = products.find((p) => p.id === productId);

    if (!targetProduct) return [];

    const recommendations = products
        .filter((product) => product.id !== productId)
        .map((product) => ({
            id: product.id,
            score: calculateCosineSimilarity(targetProduct.content, product.content),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    return recommendations;
}
