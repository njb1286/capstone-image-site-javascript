import { Dispatch } from "@reduxjs/toolkit";
import { ImageActions, ImageItem } from "./images-store";

// Redux thunk action creator
export function getImageItems() {

  return async function (dispatch: Dispatch<ImageActions>) {
    // Infers method as GET
    const response = await fetch("http://localhost:3000/api/get");
    const data = await response.json() as ImageItem[];

    dispatch({
      type: "SET_IMAGE_ITEMS",
      payload: data,
    });

    dispatch({
      type: "SET_LOADING_IMAGES",
      payload: false,
    })
  }

}