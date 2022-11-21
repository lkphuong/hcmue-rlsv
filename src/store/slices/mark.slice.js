import { createSlice } from '@reduxjs/toolkit';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { updateObjInArr } from '_func/';

const initialState = {
	marks: [],
};

export const markSlice = createSlice({
	name: 'mark',
	initialState,
	reducers: {
		updateMarks: (state, action) => {
			const updatedValues = updateObjInArr(action.payload, [...state.marks]);

			state.marks = updatedValues;
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
