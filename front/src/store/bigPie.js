import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth";
import cardsReducer from "./cardsSlice";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cartSlice'],
}

const rootReducer = combineReducers({
  authSlice: authReducer,
  cardsSlice: cardsReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['persist/PERSIST'],
    },
  }),
});

export const persistor = persistStore(store);

export default store;
