import { Reducer, configureStore } from "@reduxjs/toolkit";
import { ActionCreator } from "../types";
import { SearchBarCategory } from "../Components/SearchBar";

export const categories = ["Animals", "Architecture", "Food", "Nature", "Other", "People", "Sports", "Technology", "Travel"] as const;
export type Category = typeof categories[number];

export class ImageItem {
  constructor(
    readonly title: string,
    readonly description: string,
    readonly id: number,
    readonly date: string,
    readonly category: Category,
  ) { }
}

const initialState = {
  imageItems: [] as ImageItem[],
  searchValue: "",
  isLoadingImages: true,

  modalIsVisible: false,
  selectedCategory: "All" satisfies SearchBarCategory as SearchBarCategory
}

export type ImageState = typeof initialState;

type Actions = {
  SET_SEARCH_VALUE: string;
  SET_IMAGE_ITEMS: ImageItem[];
  SET_LOADING_IMAGES: boolean;
  ADD_IMAGE_ITEM: ImageItem;
  DELETE_IMAGE_ITEM: number;

  SET_MODAL_VISIBLE: boolean;

  SET_SELECTED_CATEGORY: SearchBarCategory;
}

export type ImageActions = ActionCreator<Actions>;

const imagesReducer: Reducer<ImageState, ImageActions> = (state = initialState, action) => {
  const insertImageItem = (item: ImageItem) => {
    const imageItemsCopy = [...state.imageItems];
    
    for (let i = 0; i < imageItemsCopy.length; i++) {
      if (item.id < imageItemsCopy[i].id) {
        imageItemsCopy.splice(i, 0, item);
        return imageItemsCopy;
      }
    }

    return null;
  }

  switch (action.type) {
    case "SET_SEARCH_VALUE":
      return {
        ...state,
        searchValue: action.payload,
      }

    case "SET_IMAGE_ITEMS": {
      const imageItems = [...action.payload].sort((a, b) => a.id - b.id);
      return {
        ...state,
        imageItems,
      }
    }

    case "SET_LOADING_IMAGES":
      return {
        ...state,
        isLoadingImages: action.payload,
      }

    case "ADD_IMAGE_ITEM": {
      const newImageItems = insertImageItem(action.payload);
      if (!newImageItems) return state;

      return {
        ...state,
        imageItems: newImageItems,
      }
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

    case "SET_SELECTED_CATEGORY":
      return {
        ...state,
        selectedCategory: action.payload,
      }

    default:
      return state;
  }
}

export const imageStore = configureStore({
  reducer: imagesReducer,
})