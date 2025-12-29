import { Actions, getState } from '../store.js';

export function renderEditor(parentElement, deckId) {
    const state = getState();
    const deck = state.decks.find(d => d.id === deckId);

    if (!deck) {
        parentElement.innerHTML = '<h2>Deck not found</h2>';
        return;
    }

    const container = document.createElement('div');
    container.className = 'glass-panel';
    container.style.padding = '2rem';
    container.style.maxWidth = '800px';
    container.style.margin = '0 auto';

    container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 2rem;">
            <h2 class="title-gradient">${deck.title} (Editing)</h2>
            <button id="delete-deck-btn" class="btn" style="background:red; color:white;">Delete Deck</button>
        </div>

        <div style="margin-bottom: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-md);">
            <h3 style="margin-bottom: 1rem;">Add New Card</h3>
            <div style="display:grid; gap: 1rem;">
                <input id="card-front" placeholder="Front (Question)" style="padding: 1rem; border-radius: var(--radius-sm); border: var(--glass-border); background: rgba(0,0,0,0.2); color: white;">
                <textarea id="card-back" placeholder="Back (Answer)" rows="3" style="padding: 1rem; border-radius: var(--radius-sm); border: var(--glass-border); background: rgba(0,0,0,0.2); color: white;"></textarea>
                <button id="add-card-btn" class="btn">Add Card</button>
            </div>
        </div>

        <div class="card-list">
            <h3>Cards (${deck.cards.length})</h3>
            <div id="cards-container" style="margin-top: 1rem; display: grid; gap: 1rem;"></div>
        </div>
    `;

    // Render Card List
    const listContainer = container.querySelector('#cards-container');
    deck.cards.forEach(card => {
        const row = document.createElement('div');
        row.style.background = 'rgba(255,255,255,0.05)';
        row.style.padding = '1rem';
        row.style.borderRadius = 'var(--radius-sm)';
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';

        row.innerHTML = `
            <div>
                <div style="font-weight:bold; margin-bottom: 0.25rem;">${card.front}</div>
                <div style="color: var(--text-muted); font-size: 0.9rem;">${card.back}</div>
            </div>
        `;
        listContainer.appendChild(row);
    });

    // Event Listeners
    container.querySelector('#delete-deck-btn').onclick = () => {
        if (confirm('Delete this deck?')) {
            Actions.deleteDeck(deckId);
            Actions.setView('dashboard');
        }
    };

    container.querySelector('#add-card-btn').onclick = () => {
        const front = container.querySelector('#card-front').value;
        const back = container.querySelector('#card-back').value;
        if (front && back) {
            Actions.addCard(deckId, front, back);
            // Inputs are cleared by re-render triggered by store update
        }
    };

    parentElement.appendChild(container);
}
