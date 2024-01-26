import { Dispatch } from "@reduxjs/toolkit";
import { Category, ImageActions, ImageItem } from "./images-store";
import { backendUrl } from "./backend-url";
import { getRequestData, getToken } from "../helpers/token";

// Redux thunk action creator
export const getImageItems = () => {
  return async function (dispatch: Dispatch<ImageActions>) {
    // Infers method as GET
    const response = await fetch(`${backendUrl}/get`, getRequestData("GET"));
    const data = await response.json() as ImageItem[];

    dispatch({
      type: "SET_IMAGE_ITEMS",
      payload: data,
    });
  }

}

export const getImageSlice = (offset: number, count: number, doneLoading?: () => void, loadedItems?: number[]) => {
  return async function (dispatch: Dispatch<ImageActions>) {
    const url = `${backendUrl}/get-slice?limit=${count}&offset=${offset}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        loadedItems: loadedItems ? loadedItems.join(",") : "",
        token: getToken() ?? "",
      }
    });
    const responseData = await response.json() as { data: ImageItem[], hasMore: boolean };

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

export const getCategoryItems = (category: Category, loadedItems?: number[]) => {
  return async function (dispatch: Dispatch<ImageActions>) {
    const url = `${backendUrl}/get?category=${category.toLowerCase()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        loadedItems: loadedItems ? loadedItems.join(",") : "",
        token: getToken() ?? "",
      }
    });
    const responseData = await response.json() as ImageItem[];

    dispatch({
      type: "ADD_IMAGE_ITEMS",
      payload: responseData,
    });
  }
}

export const getByTitle = (title: string) => {
  return async function (dispatch: Dispatch<ImageActions>) {
    const url = new URL(`${backendUrl}/get`);
    url.searchParams.set("title", title.toLowerCase());

    const response = await fetch(url, getRequestData("GET"));
    const responseData = await response.json() as ImageItem[];

    dispatch({
      type: "ADD_IMAGE_ITEMS",
      payload: responseData,
    });
  }
}