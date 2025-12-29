/**
 * FlashRecall - Main Entry Point
 */
import { initStore } from './store.js';
import { renderApp } from './components/App.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize App State
    initStore();

    // Initial Render
    const appRoot = document.getElementById('app');
    renderApp(appRoot);
});
