import { createSlice } from "@reduxjs/toolkit";

import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
  isLogined: false,
  access_token: null,
  refresh_token: null,
  role: null,
  profile: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
      state.isLogined = !!action.payload;
    },
    setToken: (state, action) => {
      state.access_token = action.payload?.access_token;
      state.refresh_token = action.payload?.refresh_token;
    },
  },
});

export const actions = authSlice.actions;

const persistConfig = {
  key: "auth",
  version: 1,
  storage,
  whitelist: ["access_token", "refresh_token"],
};

export default persistReducer(persistConfig, authSlice.reducer);
