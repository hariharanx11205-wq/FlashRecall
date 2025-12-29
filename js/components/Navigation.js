import { Actions, getState } from '../store.js';

export function renderNavigation(parentElement) {
    const nav = document.createElement('nav');
    nav.className = 'glass-panel';
    nav.style.padding = '1rem 2rem';
    nav.style.marginBottom = '2rem';
    nav.style.display = 'flex';
    nav.style.justifyContent = 'space-between';
    nav.style.alignItems = 'center';

    const state = getState();

    // Logo / Title
    const logo = document.createElement('h1');
    logo.className = 'title-gradient';
    logo.textContent = 'FlashRecall';
    logo.style.fontSize = '1.5rem';
    logo.style.fontWeight = '600';
    logo.style.cursor = 'pointer';
    logo.onclick = () => Actions.setView('dashboard');

    nav.appendChild(logo);

    // Right side actions
    const rightSide = document.createElement('div');

    // Show Back button if not on dashboard
    if (state.view !== 'dashboard') {
        const backBtn = document.createElement('button');
        backBtn.className = 'btn btn-ghost';
        backBtn.textContent = '← Dashboard';
        backBtn.onclick = () => Actions.setView('dashboard');
        rightSide.appendChild(backBtn);
    } else {
        // Show Add Deck button on Dashboard
        const addBtn = document.createElement('button');
        addBtn.className = 'btn';
        addBtn.textContent = '+ New Deck';
        addBtn.onclick = () => {
            const title = prompt("Deck Name:");
            if (title) Actions.createDeck(title);
        };
        rightSide.appendChild(addBtn);
    }

    nav.appendChild(rightSide);
    parentElement.appendChild(nav);
}
