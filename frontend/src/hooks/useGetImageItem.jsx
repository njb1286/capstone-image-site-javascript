import { useDispatch, useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react";
import { backendUrl } from "../store/backend-url";
import LoadingPage from "../Components/LoadingPage";
import { getRequestData } from "../helpers/token";

export function useGetImageItem(id) {
  const [isError, setIsError] = useState(false);
  const [imageItemState, setImageItemState] = useState(null);
  const hasRun = useRef(false);
  const dispatch = useDispatch();

  const imageItems = useSelector((state) => state.imageItems);

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
      payload: <h2>Hmmm... we couldn't find that image...</h2>,
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