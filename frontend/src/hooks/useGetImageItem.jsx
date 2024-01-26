import { useDispatch, useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react";
import { ImageItem, ImageState } from "../store/images-store";
import { backendUrl } from "../store/backend-url";
import LoadingPage from "../Components/LoadingPage";
import { getRequestData } from "../helpers/token";
import PageNotFound from "../Pages/PageNotFound";

/**
 * @typedef {ActionCreator<{ COMPONENT: JSX.Element, IMAGE_ITEM: ImageItem }>} Returns
 */

/**
 * @template T string or number or null
 * @param {T} id 
 * @returns {Returns}
 */

export function useGetImageItem(id) {
  const [isError, setIsError] = useState(false);

  /**
   * @type {[ImageItem | null, Dispatch<SetStateAction<ImageItem | null>>]}
   */
  const [imageItemState, setImageItemState] = useState(null);
  const hasRun = useRef(false);

  /**
   * @type {Dispatch<ImageActions>}
   */
  const dispatch = useDispatch();

  const imageItems = useSelector( /** @type {ImageState} */ (state) => state.imageItems);

  useEffect(() => {
    if (hasRun.current) return;

    hasRun.current = true;

    if (!id) {
      setIsError(true);
      return;
    }

    const imageItem = imageItems.find(item => item.id === +id);

    if (imageItem) {
      setImageItemState(imageItem);
      return;
    }

    getImageItem();
  }, [imageItems, id]);

  async function getImageItem() {
    try {
      const response = await fetch(`${backendUrl}/get?id=${id}`, getRequestData("GET"));

      if (response.status > 299) {
        setIsError(true);
        return;
      }

      /** @type {ImageItem} */
      const data = await response.json();

      dispatch({
        type: "ADD_IMAGE_ITEM",
        payload: data,
      })
      setImageItemState(data);
    } catch {
      setIsError(true);
    }
  }

  if (isError) {
    return {
      type: "COMPONENT",
      payload: <PageNotFound hasLink message="Hmmm... we couldn't find that image" />,
    };
  }

  if (!imageItemState) {
    return {
      type: "COMPONENT",
      payload: <LoadingPage />,
    };
  }

  return {
    type: "IMAGE_ITEM",
    payload: imageItemState,
  }
}