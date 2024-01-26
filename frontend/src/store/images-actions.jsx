import { backendUrl } from "./backend-url";
import { getRequestData, getToken } from "../helpers/token";

// Redux thunk action creator
export const getImageItems = () => {
  return async function (dispatch) {
    // Infers method as GET
    const response = await fetch(`${backendUrl}/get`, getRequestData("GET"));
    const data = await response.json();

    dispatch({
      type: "SET_IMAGE_ITEMS",
      payload: data,
    });
  }

}

export const getImageSlice = (offset, count, doneLoading, loadedItems) => {
  return async function (dispatch) {
    const url = `${backendUrl}/get-slice?limit=${count}&offset=${offset}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        loadedItems: loadedItems ? loadedItems.join(",") : "",
        token: getToken() ?? "",
      }
    });
    const responseData = await response.json();

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

export const getCategoryItems = (category, loadedItems) => {
  return async function (dispatch) {
    const url = `${backendUrl}/get?category=${category.toLowerCase()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        loadedItems: loadedItems ? loadedItems.join(",") : "",
        token: getToken() ?? "",
      }
    });
    const responseData = await response.json();

    dispatch({
      type: "ADD_IMAGE_ITEMS",
      payload: responseData,
    });
  }
}

export const getByTitle = (title) => {
  return async function (dispatch) {
    const url = new URL(`${backendUrl}/get`);
    url.searchParams.set("title", title.toLowerCase());

    const response = await fetch(url, getRequestData("GET"));
    const responseData = await response.json();

    dispatch({
      type: "ADD_IMAGE_ITEMS",
      payload: responseData,
    });
  }
}