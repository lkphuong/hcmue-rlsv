import { createSlice } from '@reduxjs/toolkit';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState = {
	filters: null,
};

export const filtersSlice = createSlice({
	name: 'filter',
	initialState,
	reducers: {
		setFilters: (state, action) => {
			const { key, value } = action.payload;
			state.filters = { ...state.filters, [key]: value };
		},
	},
});

export const actions = filtersSlice.actions;

const persistConfig = {
	key: 'filters',
	version: 1,
	storage,
	whitelist: ['filters'],
};

export default persistReducer(persistConfig, filtersSlice.reducer);
