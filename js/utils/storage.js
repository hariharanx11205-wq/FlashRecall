/**
 * Storage Service
 * Handles persistence to LocalStorage
 */

const STORAGE_KEY = 'flashrecall_data';

const defaultState = {
    decks: [
        {
            id: 'demo-deck',
            title: 'JavaScript Basics',
            cards: [
                {
                    id: 'c1',
                    front: 'What is a Closure?',
                    back: 'A function bundled with its lexical environment.',
                    interval: 0,
                    repetitions: 0,
                    easeFactor: 2.5,
                    dueDate: new Date().toISOString()
                }
            ]
        }
    ]
};

export const Storage = {
    load() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : defaultState;
        } catch (e) {
            console.error('Failed to load data', e);
            return defaultState;
        }
    },

    save(state) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('Failed to save data', e);
        }
    }
};
