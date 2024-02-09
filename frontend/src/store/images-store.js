import { configureStore } from "@reduxjs/toolkit";
import { addItemToSortedList, addItemsToSortedList } from "../helpers/addItemToSortedList";

/**
 * @type {["Animals", "Architecture", "Food", "Nature", "Other", "People", "Sports", "Technology", "Travel"]}
 */

export class ImageItem {
  title;
  description;
  id;
  date;
  category;
  
  /**
   * @param {string} title 
   * @param {string} description 
   * @param {number} id 
   * @param {string} date 
   * @param {Category} category 
   */

  constructor(title, description, id, date, category) {
    this.title = title;
    this.description = description;
    this.id = id;
    this.date = date;
    this.category = category;
  }
}

const initialState = {
  /** @type {ImageItem[]} */
  imageItems: [],

  modalIsVisible: false,
  hasMoreItems: true,

  loadedCategories: [],
  token: null,
  initialRender: false,

  tempPassword: "",
}

/* 
  Iterate over the array, and place the item in the correct position instead of
  creating a new array with the added item, then sorting it.

  I need to keep this array sorted so I can maintain item order
*/

/**
 * @param {ImageActions} action 
 */
const imagesReducer = (state = initialState, action) => {

  switch (action.type) {

    case "SET_IMAGE_ITEMS": {
      const imageItems = [...action.payload].sort((a, b) => a.id - b.id);

      return {
        ...state,
        imageItems,
      }
    }

    case "ADD_IMAGE_ITEM": {
      const newImageItems = addItemToSortedList(state.imageItems, action.payload, (item) => item.id);

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

    case "HAS_NO_MORE_ITEMS":
      return {
        ...state,
        hasMoreItems: false,
      }

    case "SET_TOKEN":
      return {
        ...state,
        token: action.payload,
      }

    case "ADD_LOADED_CATEGORY": {
      if (state.loadedCategories.includes(action.payload)) return state;

      return {
        ...state,
        loadedCategories: [...state.loadedCategories, action.payload],
      }
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

    default:
      return state;
  }
}

export const imageStore = configureStore({
  reducer: imagesReducer,
})