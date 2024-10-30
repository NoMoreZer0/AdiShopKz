import UserHistory from "@/models/UserHistory";

/**
 * Logs a user action to the UserHistory collection.
 *
 * @param {Object} options - Details of the action to log.
 * @param {string} options.userId - ID of the user performing the action.
 * @param {string} options.productId - ID of the product involved in the action.
 * @param {string} options.actionType - Type of action (e.g., "view", "like", "purchase").
 */
export async function logUserAction({ userId, productId, actionType }) {
    if (!userId || !productId || !actionType) {
        console.error("Invalid parameters for logging user action");
        return;
    }
    if (!["view", "like", "purchase"].includes(actionType)) {
        console.error("Invalid action type");
        return;
    }
    try {
        const historyEntry = new UserHistory({
            userId,
            productId,
            actionType,
        });
        await historyEntry.save();
        console.log(`Logged ${actionType} action for user ${userId} on product ${productId}`);
    } catch (error) {
        console.error("Failed to log user action:", error);
    }
}
