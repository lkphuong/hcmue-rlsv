import { createSlice } from '@reduxjs/toolkit';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState = {
	filters: null,
};

export const filterSlice = createSlice({
	name: 'filter',
	initialState,
	reducers: {
		setFilter: (state, action) => {
			state.filters = action.payload ? { ...action.payload } : null;
		},
	},
});

export const actions = filterSlice.actions;

const persistConfig = {
	key: 'filter',
	version: 1,
	storage,
	whitelist: [],
};

export default persistReducer(persistConfig, filterSlice.reducer);
