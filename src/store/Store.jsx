import { configureStore } from "@reduxjs/toolkit";
import bannerSlice from "../slice/banner.slice";
import headSlice from "../slice/head.slice";
import productSlice from "../slice/product.slice";
import shapeSlice from "../slice/shape.slice";

// import shopSlice from "../slice/Shop.slice";
// import { wishSlice } from "../slice/wishlist.slice";
// import wishSlice from "../slice/wishlist.slice";

function configStore() {
  const store = configureStore({
    reducer: {
      banner: bannerSlice,
      product: productSlice,
      head:headSlice,
      shape: shapeSlice
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });
  return store;
}

export default configStore;
