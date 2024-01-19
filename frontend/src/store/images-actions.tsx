import { Dispatch } from "@reduxjs/toolkit";
import { ImageActions, ImageItem } from "./images-store";
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