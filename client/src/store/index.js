import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; 
import placeReducer from './placeSlice';
import storage from 'redux-persist/lib/storage/session';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

const reducers = combineReducers({
    user: userReducer, 
    place: placeReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'place'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});
