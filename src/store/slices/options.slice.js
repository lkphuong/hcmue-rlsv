import { createSlice } from '@reduxjs/toolkit';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState = {
	academic_years: [],
	departments: [],
};

export const optionsSlice = createSlice({
	name: 'options',
	initialState,
	reducers: {
		setAcademicYears: (state, action) => {
			state.academic_years = action.payload;
		},
		setDepartments: (state, action) => {
			state.departments = action.payload;
		},
	},
});

export const actions = optionsSlice.actions;

const persistConfig = {
	key: 'options',
	version: 1,
	storage,
	whitelist: ['academic_years', 'departments'],
};

export default persistReducer(persistConfig, optionsSlice.reducer);
