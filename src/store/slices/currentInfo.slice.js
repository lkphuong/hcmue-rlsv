import { createSlice } from '@reduxjs/toolkit';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState = {
	academic: null,
	semester: null,
	department: null,
};

export const currentInfoSlice = createSlice({
	name: 'currentInfo',
	initialState,
	reducers: {
		setInfo: (state, action) => {
			state.academic = action.payload?.academic;
			state.semester = action.payload?.semester;
			state.department = action.payload?.department;
		},
	},
});

export const actions = currentInfoSlice.actions;

const persistConfig = {
	key: 'currentInfo',
	version: 1,
	storage,
	whitelist: ['academic', 'semester', 'department'],
};

export default persistReducer(persistConfig, currentInfoSlice.reducer);
