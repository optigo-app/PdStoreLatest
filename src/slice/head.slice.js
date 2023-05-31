import { createSlice } from "@reduxjs/toolkit";


export const headSlice = createSlice({
    name: "Head",
    initialState: {
        loading: false,
        head: [],
        error: ""
    },
    reducers: {
        getHeadLoading: (state) => {
            state.loading = true
        },
        getHeadSuccess: (state, action) => {
            state.loading = false
            state.head = action.payload
        },
        getHeadError: (state) => {
            state.loading = false
            state.error = "Can't find any data"
        },
    }
});

export const {
    getHeadLoading, getHeadSuccess, getHeadError
} = headSlice.actions;

export default headSlice.reducer