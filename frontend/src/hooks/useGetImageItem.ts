import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImageActions } from "../types";
import { ImageItem, ImageState } from "../store/images-store";
import { backendUrl } from "../store/backend-url";
import { getRequestData } from "../helpers/token";

/**
 * @param id The id of the image item to fetch
 * @returns an object with the following properties:
 * - isError: a boolean that is true if there was an error fetching the image item
 * - imageItem: the image item that was fetched. If the item is still loading, this will be null
 */
export function useGetImageItem(id: number) {
  const imageItems = useSelector((state: ImageState) => state.imageItems);
  const selectedItem = imageItems.find(item => item.id === id);
  
  const [isError, setIsError] = useState(false);
  const [imageItem, setImageItem] = useState<ImageItem | null>(selectedItem ?? null);


  /**
   * The reason for a hasRun variable is so that this hook never runs more than once. React
   * runs the useEffect hook twice when the component mounts, and this is a way to prevent that.
   */
  const hasRun = useRef(false);

  const dispatch = useDispatch<Dispatch<ImageActions>>();

  async function fetchRequest() {
    const response = await fetch(`${backendUrl}/get?id=${id}`, getRequestData("GET"));

    if (response.status > 299) {
      setIsError(true);
      return;
    }

    const item = await response.json() as ImageItem | null;

    if (!item) {
      setIsError(true);
      return;
    }

    dispatch({
      type: "ADD_IMAGE_ITEM",
      payload: item,
    });

    setImageItem(item);
  }

  useEffect(() => {
    if (hasRun.current || selectedItem) return;
    hasRun.current = true;

    fetchRequest();
  }, []);

  return { isError, imageItem };
}