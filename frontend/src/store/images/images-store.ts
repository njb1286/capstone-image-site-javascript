import { Reducer, configureStore } from "@reduxjs/toolkit";
import { ActionCreator } from "../../types";

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

  modalIsVisible: false,
}

export type ImageState = typeof initialState;

type Actions = {
  SET_SEARCH_VALUE: string;
  SET_IMAGE_ITEMS: ImageItem[];
  SET_LOADING_IMAGES: boolean;
  ADD_IMAGE_ITEM: ImageItem;
  DELETE_IMAGE_ITEM: number;

  SET_MODAL_VISIBLE: boolean;
}

export type ImageActions = ActionCreator<Actions>;

export const imagesReducer: Reducer<ImageState, ImageActions> = (state = initialState, action) => {
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

    case "DELETE_IMAGE_ITEM":
      return {
        ...state,
        imageItems: state.imageItems.filter((image) => image.id !== action.payload),
      }

    case "SET_MODAL_VISIBLE":
      return {
        ...state,
        modalIsVisible: action.payload,
      }

    default:
      return state;
  }
}

export const imageStore = configureStore({
  reducer: imagesReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});