import { Dispatch } from "@reduxjs/toolkit";
import { ImageActions, ImageItem } from "./images-store";
import { backendUrl } from "./backend-url";
import ErrorPage from "../Components/ErrorPage";

// Redux thunk action creator
export function getImageItems() {
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

export function addImageItem(id: number) {
  return async function (dispatch: Dispatch<ImageActions>) {
    const response = await fetch(`${backendUrl}/get?id=${id}`);
    const data = await response.json() as ImageItem;

    dispatch({
      type: "ADD_IMAGE_ITEM",
      payload: data,
    })
  }
}