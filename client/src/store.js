import { configureStore } from '@reduxjs/toolkit'
import sidebarReducer from './reducers/sidebarSlice';

export const store = configureStore({
    reducer: {
        sidebar: sidebarReducer,
    },
})
