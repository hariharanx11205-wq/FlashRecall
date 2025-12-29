/**
 * App Component
 * Handles routing and updates
 */
import { getState, subscribe } from '../store.js';
import { renderNavigation } from './Navigation.js';
import { renderDashboard } from './Dashboard.js';
import { renderEditor } from './Editor.js';
import { renderStudy } from './Study.js';

export function renderApp(parentElement) {
    const container = document.createElement('div');
    container.style.width = '100%';
    parentElement.appendChild(container);

    function update() {
        // Clear entire app container to re-render full layout
        container.innerHTML = '';
        const state = getState();

        // 1. Render Navigation
        renderNavigation(container);

        // 2. Render View
        const viewContainer = document.createElement('main');
        viewContainer.style.animation = 'fadeIn 0.3s ease-out';

        // Add keyframe if not exists (quick hack, ideally in CSS)
        if (!document.getElementById('anim-style')) {
            const style = document.createElement('style');
            style.id = 'anim-style';
            style.textContent = `
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `;
            document.head.appendChild(style);
        }

        container.appendChild(viewContainer);

        switch (state.view) {
            case 'dashboard':
                renderDashboard(viewContainer, state);
                break;
            case 'editor':
                renderEditor(viewContainer, state.activeDeckId);
                break;
            case 'study':
                renderStudy(viewContainer, state.activeDeckId);
                break;
            default:
                viewContainer.innerHTML = '<h2>404 - View Not Found</h2>';
        }
    }

    // Initial render
    update();

    // Subscribe to state changes
    subscribe(update);
}
