import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImageState, imageStore } from "../store/images-store";
import { getAllImageItems } from "../store/images-actions";

export function useGetAllItems() {
  const loadedItems = useSelector((state: ImageState) => state.loadedAllItems);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<typeof imageStore.dispatch>();

  // Only run this hook once on mount
  const hasRendered = useRef(false);

  useEffect(() => {
    if (loadedItems || hasRendered.current) return;    
    
    dispatch(getAllImageItems(setLoading));
    hasRendered.current = true;
  }, []);

  return loading;
}