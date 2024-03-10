import { Dispatch } from "@reduxjs/toolkit";
import { ImageActions, ImageItem } from "./images-store";
import { backendUrl } from "./backend-url";
import { getToken } from "../helpers/token";

// Redux thunk action creator
export const getAllImageItems = (loadedItems?: string) => {
  return async function (dispatch: Dispatch<ImageActions>) {    
    const response = await fetch(`${backendUrl}/get`, {
      method: "GET",
      headers: {
        "Authorization": getToken(),
        loadedItems: loadedItems ?? "",
      }
    });
    const responseData = await response.json() as ImageItem[];

    dispatch({
      type: "ADD_IMAGE_ITEMS",
      payload: responseData,
    });

    dispatch({
      type: "SET_LOADED_ITEMS",
      payload: true,
    })
  }
}