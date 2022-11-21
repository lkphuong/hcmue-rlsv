import { configureStore } from '@reduxjs/toolkit';

import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import authReducer from './slices/auth.slice';
import markReducer from './slices/mark.slice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		mark: markReducer,
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
