import { createSlice } from '@reduxjs/toolkit';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState = {
	opened: true,
};

export const menuSlice = createSlice({
	name: 'menu',
	initialState,
	reducers: {
		setMenu: (state, action) => {
			state.opened = action.payload;
		},
	},
});

export const actions = menuSlice.actions;

const persistConfig = {
	key: 'menu',
	version: 1,
	storage,
	whitelist: [],
};

export default persistReducer(persistConfig, menuSlice.reducer);
