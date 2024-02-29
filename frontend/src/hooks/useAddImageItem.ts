import { useDispatch } from "react-redux";
import { backendUrl } from "../store/backend-url"
import { ImageItem } from "../store/images-store";
import { getRequestData } from "../helpers/token";

const getImageById = async (id: number) => {
  const response = await fetch(`${backendUrl}/get?id=${id}`, getRequestData("GET"));

  if (response.status >= 299) {
    return null;
  }

  const data = await response.json() as ImageItem;
  return data;
}

const getLastImageItem = async () => {
  const response = await fetch(`${backendUrl}/last`, getRequestData("GET"));

  if (response.status >= 299) {
    return null;
  }

  const data = await response.json() as ImageItem;

  return data;
}

export const useAddImageItem = () => {
  /** @type {Dispatch<ImageActions>} */
  const dispatch = useDispatch();

  // If there is no id, get the last item and add it to the database
  const updateItems = async (id: number | undefined) => {
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