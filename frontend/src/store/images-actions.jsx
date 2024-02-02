import { ImageItem } from "./images-store";
import { backendUrl } from "./backend-url";
import { getRequestData, getToken } from "../helpers/token";

// Redux thunk action creator
export const getImageItems = () => {

  /** @param {Dispatch<ImageActions>} dispatch */
  return async function (dispatch) {

    // Infers method as GET
    const response = await fetch(`${backendUrl}/get`, getRequestData("GET"));

    /** @type {ImageItem[]} */
    const data = await response.json();

    dispatch({
      type: "SET_IMAGE_ITEMS",
      payload: data,
    });
  }

}

/**
 * 
 * @param {number} offset 
 * @param {number} count 
 * @param {(() => void) | undefined} doneLoading 
 * @param {number[] | undefined} loadedItems 
 */

export const getImageSlice = (offset, count, doneLoading, loadedItems) => {
  /** @param {Dispatch<ImageActions>} dispatch */
  return async function (dispatch) {
    const url = `${backendUrl}/get-slice?limit=${count}&offset=${offset}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        loadedItems: loadedItems ? loadedItems.join(",") : "",
        token: getToken() ?? "",
      }
    });

    /**
     * @type {{ data: ImageItem[], hasMore: boolean }}
     */
    const responseData = await response.json();

    console.log("Response data", responseData);

    dispatch({
      type: "ADD_IMAGE_ITEMS",
      payload: responseData.data,
    });

    doneLoading?.();

    if (!responseData.hasMore) {
      dispatch({
        type: "HAS_NO_MORE_ITEMS"
      })
    }
  }
}

/**
 * 
 * @param {Category} category 
 * @param {number[] | undefined} loadedItems 
 * @returns 
 */

export const getCategoryItems = (category, loadedItems) => {
  /** @param {Dispatch<ImageActions>} dispatch */
  return async function (dispatch) {
    const url = `${backendUrl}/get?category=${category.toLowerCase()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        loadedItems: loadedItems ? loadedItems.join(",") : "",
        token: getToken() ?? "",
      }
    });

    /** @type {ImageItem[]} */
    const responseData = await response.json();

    dispatch({
      type: "ADD_IMAGE_ITEMS",
      payload: responseData,
    });
  }
}

/**
 * @param {string} title 
 */

export const getByTitle = (title) => {
  /** @param {Dispatch<ImageActions>} dispatch */
  return async function (dispatch) {
    const url = new URL(`${backendUrl}/get`);
    url.searchParams.set("title", title.toLowerCase());

    const response = await fetch(url, getRequestData("GET"));

    /** @type {ImageItem[]} */
    const responseData = await response.json();

    dispatch({
      type: "ADD_IMAGE_ITEMS",
      payload: responseData,
    });
  }
}