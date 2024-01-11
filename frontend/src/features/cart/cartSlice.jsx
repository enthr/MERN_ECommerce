import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../../utils/cartUtil';

const localCart = localStorage.getItem('cart');
const initialState = localCart ? JSON.parse(localCart) : { cartItems: [], shippingAddress: {}, paymentMethod: '' };

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addToCart: (state, action) => {
			const item = action.payload;
			const existingItemIndex = state.cartItems.findIndex((x) => x._id === item._id);

			if (existingItemIndex === -1) {
				state.cartItems = [...state.cartItems, item];
			} else {
				state.cartItems[existingItemIndex].qty += item.qty;
			}

            updateCart(state);
		},
		removeFromCart: (state, action) => {
			state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
			updateCart(state);
		},
		saveShippingAddress: (state, action) => {
			state.shippingAddress = action.payload;
			localStorage.setItem('cart', JSON.stringify(state));
		},
		savePaymentMethod: (state, action) => {
			state.paymentMethod = action.payload;
			localStorage.setItem('cart', JSON.stringify(state));
		},
		clearCartItems: (state) => {
			state.cartItems = [];
			localStorage.setItem('cart', JSON.stringify(state));
		},
		resetCart: (state) => {
            state.cartItems = [];
            state.shippingAddress = {};
            state.paymentMethod = '';
            localStorage.clear();
        }
	}
});

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCartItems, resetCart } = cartSlice.actions;

export default cartSlice.reducer;