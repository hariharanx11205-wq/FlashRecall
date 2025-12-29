/**
 * Global Store (Pub/Sub)
 */
import { Storage } from './utils/storage.js';

let state = {
    view: 'dashboard', // dashboard, editor, study
    activeDeckId: null,
    decks: []
};

let listeners = [];

export function initStore() {
    const loaded = Storage.load();
    state = { ...state, ...loaded };
}

export function getState() {
    return state;
}

export function subscribe(listener) {
    listeners.push(listener);
    return () => {
        listeners = listeners.filter(l => l !== listener);
    };
}

function notify() {
    listeners.forEach(listener => listener(state));
    // Persist relevant parts
    Storage.save({ decks: state.decks });
}

export const Actions = {
    setView(view, deckId = null) {
        state.view = view;
        state.activeDeckId = deckId;
        notify();
    },

    createDeck(title) {
        const newDeck = {
            id: crypto.randomUUID(),
            title,
            cards: []
        };
        state.decks.push(newDeck);
        notify();
    },

    deleteDeck(deckId) {
        state.decks = state.decks.filter(d => d.id !== deckId);
        notify();
    },

    addCard(deckId, front, back) {
        const deck = state.decks.find(d => d.id === deckId);
        if (deck) {
            deck.cards.push({
                id: crypto.randomUUID(),
                front,
                back,
                interval: 0,
                repetitions: 0,
                easeFactor: 2.5,
                dueDate: new Date().toISOString()
            });
            notify();
        }
    },

    updateCardAfterReview(deckId, cardId, reviewData) {
        const deck = state.decks.find(d => d.id === deckId);
        if (deck) {
            const cardIndex = deck.cards.findIndex(c => c.id === cardId);
            if (cardIndex > -1) {
                deck.cards[cardIndex] = { ...deck.cards[cardIndex], ...reviewData };
                notify();
            }
        }
    }
};
