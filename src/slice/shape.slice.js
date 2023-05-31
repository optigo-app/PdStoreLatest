import { createSlice } from "@reduxjs/toolkit";


export const shapeSlice = createSlice({
    name: "Shape",
    initialState: {
        loading: false,
        shape: [],
        error: ""
    },
    reducers: {
        getShapeLoading: (state) => {
            state.loading = true
        },
        getShapeSuccess: (state, action) => {
            state.loading = false
            state.shape = action.payload
        },
        getShapeError: (state) => {
            state.loading = false
            state.error = "Can't find any data"
        },
    }
});

export const {
    getShapeLoading, getShapeSuccess, getShapeError
} = shapeSlice.actions;

export default shapeSlice.reducer