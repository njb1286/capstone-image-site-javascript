import { Reducer, configureStore } from "@reduxjs/toolkit";

export type ImageItem = {
  title: string;
  description: string;
  id: number;
  date: string;
};

const initialState = {
  imageItems: [] as ImageItem[],
  searchValue: "",
  isLoadingImages: true,
}

export type ImageState = typeof initialState;

type Actions = {
  SET_SEARCH_VALUE: string;
  SET_IMAGE_ITEMS: ImageItem[];
  SET_LOADING_IMAGES: boolean;
}

export type ImageActions = {
  [K in keyof Actions]: {
    type: K;
    payload: Actions[K];
  }
}[keyof Actions];

const imagesReducer: Reducer<ImageState, ImageActions> = (state = initialState, action) => {
  if (!state) {
    return initialState;
  }

  switch (action.type) {
    case "SET_SEARCH_VALUE":
      return {
        ...state,
        searchValue: action.payload,
      }

    case "SET_IMAGE_ITEMS":
      return {
        ...state,
        imageItems: action.payload,
      }

    case "SET_LOADING_IMAGES":
      return {
        ...state,
        isLoadingImages: action.payload,

      }

    default:
      return state;
  }
}

export const imageStore = configureStore({
  reducer: imagesReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});