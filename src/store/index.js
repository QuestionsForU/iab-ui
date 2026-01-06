import { configureStore } from '@reduxjs/toolkit'
import apiReducer from "./api-db"
import { persistReducer } from 'redux-persist'
import storageSession from 'redux-persist/lib/storage/session'

const persistConfig = {
    key: 'root',
    storage: storageSession
};

const appReducer = (state, action) => {
    if (action?.type === 'user/loginUser/fulfilled' 
        && !action?.meta?.arg
    ) {
        return apiReducer(undefined, action)
    }

    return apiReducer(state, action)
}

const persistedReducer = persistReducer(persistConfig, appReducer);


export const store = configureStore({
    reducer: {
        api: persistedReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
})

store.subscribe(() => {
    if (store.getState().api.message)
        console.log(store.getState().api.message);
});