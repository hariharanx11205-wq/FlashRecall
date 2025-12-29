import { Actions, getState } from '../store.js';
import { calculateNextReview, Grades } from '../utils/algorithm.js';

export function renderStudy(parentElement, deckId) {
    const state = getState();
    const deck = state.decks.find(d => d.id === deckId);

    if (!deck) return;

    // Filter due cards
    const now = new Date();
    const dueCards = deck.cards.filter(c => new Date(c.dueDate) <= now);

    // Sort slightly? No, just take the first one.
    const currentCard = dueCards[0];

    const container = document.createElement('div');
    container.style.maxWidth = '600px';
    container.style.margin = '0 auto';
    container.style.textAlign = 'center';

    if (!currentCard) {
        container.innerHTML = `
            <div class="glass-panel" style="padding: 4rem;">
                <h2 class="title-gradient" style="font-size: 2.5rem; margin-bottom: 1rem;">All Caught Up!</h2>
                <p style="font-size: 1.25rem; color: var(--text-muted);">You have no more cards to review for now.</p>
                <button class="btn" id="finish-btn" style="margin-top: 2rem;">Back to Dashboard</button>
            </div>
        `;
        parentElement.appendChild(container); // Wait, need to listen to click
        // But we can't easily querySelect a freshly added InnerHTML string's child if we don't append first?
        // Actually we can add event listener after append.

        // Wait, 'parentElement.appendChild' is needed first? No.
        // Let's rely on standard DOM apis

        // Re-write to use createElement for button to be safe
        parentElement.appendChild(container);
        const btn = document.getElementById('finish-btn');
        if (btn) btn.onclick = () => Actions.setView('dashboard');
        return;
    }

    // Active Card View
    container.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <span>${dueCards.length} cards due</span>
        </div>
        
        <div class="flashcard-container" style="perspective: 1000px; cursor: pointer; height: 300px;">
            <div class="flashcard-inner" style="position: relative; width: 100%; height: 100%; text-align: center; transition: transform 0.6s; transform-style: preserve-3d;">
                
                <!-- Front -->
                <div class="glass-panel" style="position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; display: flex; align-items: center; justify-content: center; padding: 2rem;">
                    <h2 style="font-size: 1.5rem;">${currentCard.front}</h2>
                    <p style="position:absolute; bottom: 1rem; opacity: 0.5; font-size: 0.8rem;">Click to Flip</p>
                </div>

                <!-- Back -->
                <div class="glass-panel" style="position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; transform: rotateY(180deg); display: flex; flex-direction:column; align-items: center; justify-content: center; padding: 2rem; background: rgba(30, 20, 50, 0.8);">
                    <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">${currentCard.back}</h2>
                </div>
            </div>
        </div>

        <div id="rating-controls" style="margin-top: 2rem; opacity: 0; pointer-events: none; transition: opacity 0.3s; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;">
            <button class="btn" style="background: #e74c3c">Again</button>
            <button class="btn" style="background: #e67e22">Hard</button>
            <button class="btn" style="background: #f1c40f; color: black;">Good</button>
            <button class="btn" style="background: #2ecc71">Easy</button>
        </div>
    `;

    parentElement.appendChild(container);

    // Logic
    const cardEl = container.querySelector('.flashcard-inner');
    const controls = container.querySelector('#rating-controls');
    let isFlipped = false;

    container.querySelector('.flashcard-container').onclick = () => {
        if (!isFlipped) {
            cardEl.style.transform = 'rotateY(180deg)';
            controls.style.opacity = '1';
            controls.style.pointerEvents = 'all';
            isFlipped = true;
        }
    };

    // Rating Buttons
    const buttons = controls.querySelectorAll('button');
    const grades = [Grades.AGAIN, Grades.HARD, Grades.GOOD, Grades.EASY];

    buttons.forEach((btn, idx) => {
        btn.onclick = () => {
            const result = calculateNextReview(currentCard, grades[idx]);
            Actions.updateCardAfterReview(deckId, currentCard.id, result);
        };
    });
}
