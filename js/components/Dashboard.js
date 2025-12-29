import { Actions } from '../store.js';

export function renderDashboard(parentElement, state) {
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
    grid.style.gap = '2rem';

    if (state.decks.length === 0) {
        parentElement.innerHTML = `<div style="text-align:center; padding: 4rem; color: var(--text-muted)">
            <h2>No Decks Found</h2>
            <p>Create a new deck to get started!</p>
        </div>`;
        return;
    }

    state.decks.forEach(deck => {
        const cardDocs = deck.cards.length;
        const due = deck.cards.filter(c => new Date(c.dueDate) <= new Date()).length;

        const el = document.createElement('div');
        el.className = 'glass-panel';
        el.style.padding = '2rem';
        el.style.cursor = 'pointer';
        el.style.transition = 'transform 0.2s';

        // Hover effect helper
        el.onmouseenter = () => el.style.transform = 'translateY(-5px)';
        el.onmouseleave = () => el.style.transform = 'translateY(0)';

        el.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:1rem;">
                <h3 style="font-size: 1.25rem;">${deck.title}</h3>
                <span style="font-size: 0.8rem; background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 10px;">${cardDocs} cards</span>
            </div>
            
            <div style="margin-top: 1rem; color: var(--text-muted);">
                <p>Due: <span style="color: ${due > 0 ? 'var(--accent)' : 'inherit'}; font-weight: bold;">${due}</span></p>
            </div>
            
            <div style="margin-top: 2rem; display: flex; gap: 0.5rem;">
                <button class="btn-study" style="flex:1">Study</button>
                <button class="btn-edit btn-ghost" style="padding: 0.5rem 1rem;">Edit</button>
            </div>
        `;

        // Event delegation logic
        const studyBtn = el.querySelector('.btn-study');
        const editBtn = el.querySelector('.btn-edit');

        studyBtn.className = 'btn'; // Re-use global class

        studyBtn.onclick = (e) => {
            e.stopPropagation();
            Actions.setView('study', deck.id);
        };

        editBtn.onclick = (e) => {
            e.stopPropagation();
            Actions.setView('editor', deck.id);
        };

        grid.appendChild(el);
    });

    parentElement.appendChild(grid);
}
