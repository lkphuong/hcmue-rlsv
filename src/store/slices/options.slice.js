import { createSlice } from '@reduxjs/toolkit';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState = {
	academic_years: [],
	semesters: [],
	departments: [],
};

export const optionsSlice = createSlice({
	name: 'options',
	initialState,
	reducers: {
		setAcademicYears: (state, action) => {
			state.academic_years = action.payload;
		},
		setSemesters: (state, action) => {
			state.semesters = action.payload;
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
	whitelist: ['academic_years', 'semesters', 'departments'],
};

export default persistReducer(persistConfig, optionsSlice.reducer);
