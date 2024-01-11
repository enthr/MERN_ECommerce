import { createSlice } from '@reduxjs/toolkit';

const storedTheme = localStorage.getItem('darkMode');

const initialState = {
    darkMode: storedTheme ? JSON.parse(storedTheme) : false
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        changeTheme(state) {
            state.darkMode = !state.darkMode;
            localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
        }
    }
});

export const { changeTheme } = themeSlice.actions;

export default themeSlice.reducer;