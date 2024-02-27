import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { ImageActions } from "../types";
import { ImageItem } from "../store/images-store";
import { backendUrl } from "../store/backend-url";
import { getRequestData } from "../helpers/token";

export function useGetImageItem(id: number) {
  const [isError, setIsError] = useState(false);
  const [imageItem, setImageItem] = useState<ImageItem | null>(null);

  const hasRun = useRef(false);

  const dispatch = useDispatch<Dispatch<ImageActions>>();

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function fetchRequest() {
      const response = await fetch(`${backendUrl}/get?id=${id}`, getRequestData("GET"));

      if (response.status > 299) {
        setIsError(true);
        return;
      }

      const item = await response.json() as ImageItem;

      dispatch({
        type: "ADD_IMAGE_ITEM",
        payload: item,
      });

      setImageItem(item);
    }

    fetchRequest();
  }, []);

  return { isError, imageItem };
}