import { useDispatch } from "react-redux";
import { backendUrl } from "../store/backend-url"
import { ImageItem } from "../store/images-store";
import { getRequestData } from "../helpers/token";

/** @param {number} id */
const getImageById = async (id) => {
  const response = await fetch(`${backendUrl}/get?id=${id}`, getRequestData("GET"));

  if (response.status >= 299) {
    return null;
  }

  /** @type {ImageItem} */
  const data = await response.json();
  return data;
}

const getLastImageItem = async () => {
  const response = await fetch(`${backendUrl}/last`, getRequestData("GET"));

  if (response.status >= 299) {
    return null;
  }

  /** @type {ImageItem} */
  const data = await response.json();

  return data;
}

export const useAddImageItem = () => {
  /** @type {Dispatch<ImageActions>} */
  const dispatch = useDispatch();

  // If there is no id, get the last item and add it to the database
  /** @param {number | undefined} id */
  const updateItems = async (id) => {
    if (id) {
      const imageItem = await getImageById(id);

      if (!imageItem) return;

      dispatch({
        type: "ADD_IMAGE_ITEM",
        payload: imageItem,
      });
    }

    const imageItem = await getLastImageItem();
    if (!imageItem) return;

    dispatch({
      type: "ADD_IMAGE_ITEM",
      payload: imageItem,
    })
  }

  return updateItems;
}