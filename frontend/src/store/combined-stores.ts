import { Reducer, configureStore } from "@reduxjs/toolkit";

import { ImageState, imagesReducer } from "./images/images-store";
import { ModalState, modalReducer } from "./modal/modal-store";

export const store = configureStore({
  reducer: {
    images: imagesReducer as Reducer<ImageState>,
    modal: modalReducer as Reducer<ModalState>,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type StoreState = ReturnType<typeof store.getState>;