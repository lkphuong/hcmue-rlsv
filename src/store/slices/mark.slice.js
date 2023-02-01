import { createSlice } from '@reduxjs/toolkit';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { updateHeaderIdInArr, updateObjInArr } from '_func/';

const initialState = {
	marks: [],
	available: true,
};

export const markSlice = createSlice({
	name: 'mark',
	initialState,
	reducers: {
		renewMarks: (state, action) => {
			state.marks = action.payload;
		},
		updateMarks: (state, action) => {
			const updatedValues = updateObjInArr(action.payload, [...state.marks]);

			state.marks = updatedValues;
		},
		updateHeaderId: (state, action) => {
			const updatedValues = updateHeaderIdInArr(
				action.payload.header_id,
				action.payload.item_id,
				[...state.marks]
			);

			state.marks = updatedValues;
		},
		setAvailable: (state, action) => {
			state.available = action.payload;
		},
		clearMarks: (state) => {
			state.marks = [];
			state.available = true;
		},
	},
});

export const actions = markSlice.actions;

const persistConfig = {
	key: 'mark',
	version: 1,
	storage,
	whitelist: [],
};

export default persistReducer(persistConfig, markSlice.reducer);
