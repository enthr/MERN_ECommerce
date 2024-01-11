import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import cartReducer from '../features/cart/cartSlice';
import authReducer from '../features/auth/authSlice';
import themeSlice from '../features/theme/themeSlice';
import { api } from '../services/api';

const store = configureStore({
	reducer: {
        cart: cartReducer,
        auth: authReducer,
        theme: themeSlice,
		[api.reducerPath]: api.reducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
	devTools: true
});

setupListeners(store.dispatch);

export default store;