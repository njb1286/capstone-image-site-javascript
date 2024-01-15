import { Reducer, configureStore } from "@reduxjs/toolkit";

export class ImageItem {
  public title: string;
  public description: string;
  public id: number;
  public date: string;

  public constructor(title: string, description: string, id: number, date: string) {
    this.title = title;
    this.description = description;
    this.id = id;
    this.date = date;
  }
}

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
  ADD_IMAGE_ITEM: ImageItem;
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

    case "ADD_IMAGE_ITEM":
      return {
        ...state,
        imageItems: [...state.imageItems, action.payload],
      }

    default:
      return state;
  }
}

export const imageStore = configureStore({
  reducer: imagesReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});