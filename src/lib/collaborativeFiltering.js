import UserHistory from '@/models/UserHistory';
import Product from '@/models/Product';
import User from '@/models/User';
import { create, all } from 'mathjs';

const math = create(all)

async function setupInteractionMatrix() {
    const users = await User.find().select('_id');
    const products = await Product.find().select('_id');
    const interactionMatrix = Array(users.length)
        .fill(null)
        .map(() => Array(products.length).fill(0));
    const actionScores = {
        view: 1,
        favorite: 3,
        purchase: 5
    };
    const interactions = await UserHistory.find();
    interactions.forEach(interaction => {
        const userIndex = users.findIndex(user => user._id.equals(interaction.userId));
        const productIndex = products.findIndex(product => product._id.equals(interaction.productId));

        if (userIndex !== -1 && productIndex !== -1) {
            interactionMatrix[userIndex][productIndex] += actionScores[interaction.actionType] || 0;
        }
    });
    return { interactionMatrix, users, products };
}

function calculateRecommendations(interactionMatrix, targetUserIndex) {
    const similarityScores = [];
    const targetUserInteractions = interactionMatrix[targetUserIndex];
    console.log("TargetUserIndex " + targetUserIndex);
    interactionMatrix.forEach((userInteractions, index) => {
        if (index !== targetUserIndex) {
            const targetUserNorm = math.norm(targetUserInteractions);
            const userNorm = math.norm(userInteractions);
            if (targetUserNorm === 0 || userNorm === 0) {
                similarityScores.push({ index, similarity: 0 });
            } else {
                const similarity = math.dot(targetUserInteractions, userInteractions) /
                    (targetUserNorm * userNorm);
                similarityScores.push({ index, similarity });
            }
        }
    });
    similarityScores.sort((a, b) => b.similarity - a.similarity);
    const K = 5; 
    const MIN_SIMILARITY = 0.1;
    const topUsers = similarityScores.filter(user => user.similarity > MIN_SIMILARITY).slice(0, K);
    const productScores = interactionMatrix[0].map((_, colIndex) => {
        return topUsers.reduce((sum, user) => sum + interactionMatrix[user.index][colIndex] * user.similarity, 0);
    });
    const recommendedProducts = productScores
        .map((score, index) => ({ index, score }))
        .sort((a, b) => b.score - a.score);
    return recommendedProducts;
}

export async function getRecommendationsForUser(userId) {
    const { interactionMatrix, users, products } = await setupInteractionMatrix();
    const targetUserIndex = users.findIndex(user => user._id.equals(userId));
    if (targetUserIndex === -1) throw new Error("User not found");

    const recommendations = calculateRecommendations(interactionMatrix, targetUserIndex);

    return recommendations.slice(0, 5).map(rec => ({
        product: products[rec.index]._id,
        score: rec.score
    }));
}