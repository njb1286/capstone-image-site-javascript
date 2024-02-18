import { useState } from "react"
import { ImageItem } from "../store/images-store";
import { Category } from "../types";
import { useSelector } from "react-redux";

export const useConsecutiveLoad = () => {
  const loadedImageItems = useSelector((state: ImageState) => state.imageItems);
  const [items, setItems] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<Category | null>(null);
  const [search, setSearch] = useState<string | null>(null);

  function initialRender(itemsToRender?: number) {
    const itemsToLoad = itemsToRender ?? 9;

    if (loadedImageItems.length >= itemsToLoad) {
      setLoading(false);
      setItems(loadedImageItems);
      return;
    }

    setLoading(false);
  }

  return { items, loading, setFilter, setSearch, initialRender }
}