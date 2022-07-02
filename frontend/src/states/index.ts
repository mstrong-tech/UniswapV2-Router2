import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import applicationReducer from './application';

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    application: applicationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
