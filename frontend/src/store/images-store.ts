import { Reducer, configureStore } from "@reduxjs/toolkit";
import { ActionCreator } from "../types";
import { SearchBarCategory } from "../Components/SearchBar";

export const categories = ["Animals", "Architecture", "Food", "Nature", "Other", "People", "Sports", "Technology", "Travel"] as const;
export type Category = typeof categories[number];

export class ImageItem {
  constructor(
    public title: string,
    public description: string,
    public readonly id: number,
    public readonly date: string,
    public category: Category,
  ) { }
}

const initialState = {
  imageItems: [] as ImageItem[],
  searchValue: "",

  modalIsVisible: false,
  selectedCategory: "All" satisfies SearchBarCategory as SearchBarCategory
}

export type ImageState = typeof initialState;

type Optional<T extends object> = {
  [K in keyof T]?: T[K];
}

type Actions = {
  SET_SEARCH_VALUE: string;
  SET_IMAGE_ITEMS: ImageItem[];
  ADD_IMAGE_ITEM: ImageItem;
  UPDATE_IMAGE_ITEM: Optional<Omit<ImageItem, "date">> & { id: number };
  DELETE_IMAGE_ITEM: number;

  SET_MODAL_VISIBLE: boolean;

  SET_SELECTED_CATEGORY: SearchBarCategory;
}

export type ImageActions = ActionCreator<Actions>;

const imagesReducer: Reducer<ImageState, ImageActions> = (state = initialState, action) => {

  /* 
    Iterate over the array, and place the item in the correct position instead of
    creating a new array with the added item, then sorting it.

    I need to keep this array sorted so I can maintain item order
  */
  const insertImageItem = (item: ImageItem) => {
    const imageItemsCopy = [...state.imageItems];

    let insertionIndex = -1;

    for (let i = 0; i < imageItemsCopy.length; i++) {
      if (item.id < imageItemsCopy[i].id && insertionIndex === -1) {
        insertionIndex = i;
        continue;
      }

      if (insertionIndex !== -1 && imageItemsCopy[i].id === item.id) {
        return null;
      }
    }

    if (insertionIndex !== -1) {
      imageItemsCopy.splice(insertionIndex, 0, item);
      return imageItemsCopy;
    }

    imageItemsCopy.push(item);
    return imageItemsCopy;
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

    case "ADD_IMAGE_ITEM": {
      const newImageItems = insertImageItem(action.payload);

      if (!newImageItems) return state;

      return {
        ...state,
        imageItems: newImageItems,
      }
    }

    case "UPDATE_IMAGE_ITEM": {
      return {
        ...state,
        imageItems: state.imageItems.map(item => {
          if (item.id === action.payload.id) {
            return {
              ...item,
              ...action.payload,
            }
          }

          return item;
        })
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