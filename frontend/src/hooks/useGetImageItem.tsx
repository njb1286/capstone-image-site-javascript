import { useDispatch, useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react";
import { ImageActions, ImageItem, ImageState } from "../store/images-store";
import { backendUrl } from "../store/backend-url";
import { ActionCreator } from "../types";
import LoadingPage from "../Components/LoadingPage";
import { Dispatch } from "@reduxjs/toolkit";

type ReturnType = ActionCreator<{
  COMPONENT: JSX.Element;
  IMAGE_ITEM: ImageItem;
}>;

export function useGetImageItem<T extends (string | number) | null>(id: T): ReturnType {
  const [isError, setIsError] = useState(false);
  const [imageItemState, setImageItemState] = useState<ImageItem | null>(null);
  const hasRun = useRef(false);
  const dispatch = useDispatch<Dispatch<ImageActions>>();

  const imageItems = useSelector((state: ImageState) => state.imageItems);

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
      const response = await fetch(`${backendUrl}/get?id=${id}`);

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