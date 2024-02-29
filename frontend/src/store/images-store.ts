import { Reducer, configureStore } from "@reduxjs/toolkit";
import { ActionCreator, ActionCreatorNoPayload } from "../types";
import { addItemToSortedList, addItemsToSortedList } from "../helpers/addItemToSortedList";

export const categories = ["Animals", "Architecture", "Food", "Nature", "Other", "People", "Sports", "Technology", "Travel"] as const;
export type Category = typeof categories[number];
export type AllCategories = "All" | Category;

export class ImageItem {
  constructor(
    public title: string,
    public description: string,
    public readonly id: number,
    public readonly date: string,
    public category: Category,
  ) { }
}

type HasMore = {
  [_ in AllCategories]?: boolean;
}

const initialState = {
  imageItems: [] as ImageItem[],
  loadedAllItems: false,

  modalIsVisible: false,

  token: null as string | null,
  initialRender: false,

  tempPassword: "",
}

export type ImageState = typeof initialState;

type Optional<T extends object> = {
  [K in keyof T]?: T[K];
}

export type ImageActions = ActionCreator<{
  SET_IMAGE_ITEMS: ImageItem[];
  SET_LOADED_ITEMS: boolean;

  ADD_IMAGE_ITEM: ImageItem;
  ADD_IMAGE_ITEMS: ImageItem[];
  UPDATE_IMAGE_ITEM: Optional<Omit<ImageItem, "date">> & { id: number };
  DELETE_IMAGE_ITEM: number;

  SET_MODAL_VISIBLE: boolean;
  ADD_LOADED_CATEGORY: Category;
  SET_TOKEN: string | null,

  SET_TEMP_PASSWORD: string;

}> | ActionCreatorNoPayload<[
  "INITIAL_RENDER"
]>;

const imagesReducer: Reducer<ImageState, ImageActions> = (state = initialState, action) => {
  switch (action.type) {

    case "SET_IMAGE_ITEMS": {
      const imageItems = [...action.payload].sort((a, b) => a.id - b.id);

      return {
        ...state,
        imageItems,
      }
    }

    case "ADD_IMAGE_ITEM": {
      const newImageItems = addItemToSortedList(state.imageItems, action.payload, item => item.id);

      if (!newImageItems) return state;

      return {
        ...state,
        imageItems: newImageItems,
      }
    }

    case "ADD_IMAGE_ITEMS": {
      const newImageItems = addItemsToSortedList(state.imageItems, action.payload, (item) => item.id);

      return {
        ...state,
        imageItems: newImageItems
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

    case "SET_TOKEN":
      return {
        ...state,
        token: action.payload,
      }

    case "INITIAL_RENDER":
      return {
        ...state,
        initialRender: true,
      }

    case "SET_TEMP_PASSWORD":
      return {
        ...state,
        tempPassword: action.payload,
      }

    case "SET_LOADED_ITEMS":
      return {
        ...state,
        loadedAllItems: action.payload,
      }

    default:
      return state;
  }
}

export const imageStore = configureStore({
  reducer: imagesReducer,
})