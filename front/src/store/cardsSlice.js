import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const cardsSlice = createSlice({
    name: 'cards',
    initialState,
    reducers: {
        addCard: (state, action) => {
            return [...state, action.payload];
        },
        setCards: (state, action) => {
            return action.payload;
        },
    },
});

export const cardsSliceActions = cardsSlice.actions;

export default cardsSlice.reducer;
