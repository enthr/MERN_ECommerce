import { createSlice } from '@reduxjs/toolkit';

const userInfoFromStorage = localStorage.getItem('userInfo') || null;

const initialState = {
    userInfo: (userInfoFromStorage) ? JSON.parse(userInfoFromStorage) : null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        clearUserInfo: (state) => {
            state.userInfo = null;
            localStorage.clear();
        }
    }
});

export const { setCredentials, clearUserInfo } = authSlice.actions;

export default authSlice.reducer;