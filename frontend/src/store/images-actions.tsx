import { Dispatch } from "@reduxjs/toolkit";
import { Category, ImageActions, ImageItem } from "./images-store";
import { backendUrl } from "./backend-url";
import { getRequestData, getToken } from "../helpers/token";

// Redux thunk action creator
export const getAllImageItems = (setLoading?: (value: boolean) => void) => {
  return async function (dispatch: Dispatch<ImageActions>) {    
    const response = await fetch(`${backendUrl}/get`, getRequestData("GET"));
    const responseData = await response.json() as ImageItem[];

    dispatch({
      type: "ADD_IMAGE_ITEMS",
      payload: responseData,
    });

    dispatch({
      type: "SET_LOADED_ITEMS",
      payload: true,
    })

    setLoading?.(false);
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