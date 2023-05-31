import { createSlice } from "@reduxjs/toolkit";


export const productSlice = createSlice({
    name: "Product",
    initialState: {
        loading: false,
        product: [],
        metalCaratArr: [],
        error: "",

        priceLoading: false,
        store_price: [],
        metalPurity: [],
        metalColorArr: [],
        store_price_error: "",

        saveLoading: false,
        saveSuccess: [],
        saveError: '',

        colorImageLoading: false,
        colorImageSuccess: [],
        colorImageError: ""
    },
    reducers: {
        getProductLoading: (state) => {
            state.loading = true
        },
        getProductSuccess: (state, action) => {
            state.loading = false
            state.product = action.payload.rd
            state.metalCaratArr = action.payload.metalCarat
        },
        getProductError: (state) => {
            state.loading = false
            state.error = "Can't find any data"
        },

        getPriceLoading: (state) => {
            state.priceLoading = true
        },
        getPriceSuccess: (state, action) => {
            state.priceLoading = false
            state.store_price = action.payload.pdprice
            state.metalPurity = action.payload.metalPurity
            state.metalColorArr = action.payload.metalColor
        },
        getPriceError: (state) => {
            state.priceLoading = false
            state.store_price_error = "Can't find any data"
        },

        saveOrderLoading: state => {
            state.saveLoading = true;
            state.saveSuccess = [];
            state.saveError = ""
        },
        saveOrderSuccess: (state, action) => {
            state.saveLoading = false;
            state.saveSuccess = action.payload;
        },
        saveOrderError: (state, action) => {
            state.saveLoading = false;
            state.saveError = action.payload;
        },

        colorImageRequest: state => {
            state.colorImageLoading = true
            state.colorImageSuccess = []
            state.colorImageError = ""
        },
        colorSuccess: (state, action) => {
            state.colorImageLoading = false
            state.colorImageSuccess = action.payload
        },
        colorError: (state, action) => {
            state.colorImageLoading = false
            state.colorImageError = action.payload
        },
    }
});

export const {
    getProductLoading, getProductSuccess, getProductError, getPriceLoading, getPriceSuccess, getPriceError, saveOrderLoading, saveOrderSuccess, saveOrderError, colorImageRequest, colorSuccess, colorError
} = productSlice.actions;

export default productSlice.reducer