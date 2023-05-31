import { createSlice } from "@reduxjs/toolkit";


export const bannerSlice = createSlice({
    name: "Banner",
    initialState: {
        loading: false,
        banner: "",
        error: "",
        imagepath:"",
        FrontEnd_RegNo:"",
        data_updated:0
    },
    reducers: {
        getBannerLoading: (state) => {
            state.loading = true
        },
        getBannerSuccess: (state, action) => {
            state.loading = false
            state.banner = action.payload.banner
            state.imagepath = action.payload.imagepath
            state.FrontEnd_RegNo = action.payload.FrontEnd_RegNo
            state.data_updated=action.payload.isDataEdit
        },
        getBannerError: (state) => {
            state.loading = false
            state.error = "Can't find any images"
        },
    }
});

export const {
    getBannerLoading, getBannerSuccess, getBannerError
} = bannerSlice.actions;

export default bannerSlice.reducer