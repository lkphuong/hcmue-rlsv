import { configureStore } from '@reduxjs/toolkit';

import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import authReducer from './slices/auth.slice';
import markReducer from './slices/mark.slice';
import optionsReducer from './slices/options.slice';
import menuReducer from './slices/menu.slice';
import formReducer from './slices/form.slice';
import filterReducer from './slices/filter.slice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		mark: markReducer,
		options: optionsReducer,
		menu: menuReducer,
		form: formReducer,
		filter: filterReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
	devTools: true,
});

export let persistor = persistStore(store);
