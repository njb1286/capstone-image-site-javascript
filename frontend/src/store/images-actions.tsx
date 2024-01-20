import { Dispatch } from "@reduxjs/toolkit";
import { Category, ImageActions, ImageItem } from "./images-store";
import { backendUrl } from "./backend-url";

// Redux thunk action creator
export const getImageItems = () => {
  return async function (dispatch: Dispatch<ImageActions>) {
    // Infers method as GET
    const response = await fetch(`${backendUrl}/get`);
    const data = await response.json() as ImageItem[];

    dispatch({
      type: "SET_IMAGE_ITEMS",
      payload: data,
    });
  }

}

export const getImageSlice = (offset: number, count: number, doneLoading?: () => void, category?: Category) => {
  return async function (dispatch: Dispatch<ImageActions>) {
    let url = `${backendUrl}/get-slice?limit=${count}&offset=${offset}`;
    if (category) {
      url += `&category=${category.toLowerCase()}`;
    }

    const response = await fetch(url);
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