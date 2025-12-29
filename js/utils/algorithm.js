/**
 * Spaced Repetition Algorithm (Simplified SM-2)
 */

export const Grades = {
    AGAIN: 0,
    HARD: 3,
    GOOD: 4,
    EASY: 5
};

/**
 * Calculate next review data
 * @param {object} card - The card object (must have interval, repetitions, easeFactor)
 * @param {number} grade - User grade (0-5)
 * @returns {object} - Updated { interval, repetitions, easeFactor, dueDate }
 */
export function calculateNextReview(card, grade) {
    let { interval, repetitions, easeFactor } = card;

    // Defaults for new cards
    if (!interval) interval = 0;
    if (!repetitions) repetitions = 0;
    if (!easeFactor) easeFactor = 2.5;

    if (grade < 3) {
        // Failed recall
        repetitions = 0;
        interval = 1;
    } else {
        // Successful recall
        if (repetitions === 0) {
            interval = 1;
        } else if (repetitions === 1) {
            interval = 6;
        } else {
            interval = Math.round(interval * easeFactor);
        }
        repetitions += 1;
    }

    // Update Ease Factor
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    // Calculate Due Date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + interval);

    return {
        interval,
        repetitions,
        easeFactor,
        dueDate: dueDate.toISOString()
    };
}
