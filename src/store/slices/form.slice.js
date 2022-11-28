import { createSlice } from '@reduxjs/toolkit';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState = {
	form_id: null,
	header_id: null,
	title_id: null,
};

export const formSlice = createSlice({
	name: 'form',
	initialState,
	reducers: {
		setFormId: (state, action) => {
			state.form_id = action.payload;
		},
		setHeaderId: (state, action) => {
			state.header_id = action.payload;
		},
		setTitleId: (state, action) => {
			state.title_id = action.payload;
		},
		clearForm: (state) => {
			state.form_id = null;
			state.header_id = null;
			state.title_id = null;
		},
	},
});

export const actions = formSlice.actions;

const persistConfig = {
	key: 'form',
	version: 1,
	storage,
	whitelist: ['form_id', 'header_id', 'title_id'],
};

export default persistReducer(persistConfig, formSlice.reducer);
