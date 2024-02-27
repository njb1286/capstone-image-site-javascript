import { useEffect, useRef, useState } from "react"
import { AllCategories, ImageActions, ImageItem, ImageState } from "../store/images-store";
import { useDispatch, useSelector } from "react-redux";
import { backendUrl } from "../store/backend-url";
import { getToken } from "../helpers/token";

type ConsecutiveLoadOptions = {
  defaultCategory?: AllCategories;
}

export const useConsecutiveLoad = <T extends HTMLElement, U extends HTMLElement>(loadingElementRef: React.RefObject<T>, containerElementRef: React.RefObject<U>, options: ConsecutiveLoadOptions = {
  defaultCategory: "All"
}) => {
  const loadedImageItems = useSelector((state: ImageState) => state.imageItems);
  const loadedCategories = useSelector((state: ImageState) => state.hasMore);
  const dispatch = useDispatch<Dispatch<ImageActions>>();
  const [items, setItems] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<AllCategories>(options?.defaultCategory ?? "All");
  const [search, setSearch] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [mounted, setMounted] = useState(false);

  // The reason for using a ref is because state does not update inside the fetchItems function
  const loadedImageItemsRef = useRef(loadedImageItems);
  const currentFilterRef = useRef(filter);
  const currentSearchRef = useRef(search);
  const loadedCategoriesRef = useRef(loadedCategories);
  const hasMoreRef = useRef(hasMore);
  const elementIsVisible = useRef(false);
  const isLoading = useRef(false);

  const observer = useRef(new IntersectionObserver(([entry]) => {
    elementIsVisible.current = entry.isIntersecting;
  }, {
    rootMargin: "0px",
    threshold: 0.1
  }));

  const scrollHandler = () => {
    if (!elementIsVisible.current || isLoading.current) return;
    
    renderNext();
  }

  useEffect(() => {
    isLoading.current = loading;
  }, [loading]);

  useEffect(() => {
    if (!mounted) return;
    if (loadingElementRef.current) {
      observer.current.observe(loadingElementRef.current);
    }
    containerElementRef.current?.addEventListener("scroll", scrollHandler);

    renderNext();

    return () => {
      containerElementRef.current?.removeEventListener("scroll", scrollHandler);
    }
  }, [mounted])

  useEffect(() => {
    setMounted(true);
  }, []);

  // Tracks when the global state changes, and updates the local state according to the filter and search
  useEffect(() => {
    const newItems = loadedImageItems.filter(item => {
      if (filter && filter !== "All" && item.category !== filter) return false;
      if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

    setItems(newItems);
    loadedImageItemsRef.current = newItems;
    currentFilterRef.current = filter;
    currentSearchRef.current = search;
  }, [loadedImageItems, filter, search]);

  useEffect(() => {
    loadedCategoriesRef.current = loadedCategories;
  }, [loadedCategories]);

  /**
   * The global state tracks which categories have more items in an object in this structure:
   * {
   *  "All": true,
   *  "Animals": true,
   *  ...
   * }
   * 
   * This useEffect hook updates the local hasMore state in this hook when the filter gets
   * changed
   */
  useEffect(() => {
    const categoryHasMore = loadedCategories[filter];
    if (categoryHasMore === undefined) return;
    setHasMore(categoryHasMore);
    hasMoreRef.current = categoryHasMore;
  }, [filter]);

  const handleSetFilter = (category: AllCategories) => {    
    setFilter(category);
    renderNext();
  }

  const handleSetSearch = (search: string) => {
    setSearch(search);
    renderNext();
  }

  const fetchItems = async (limit: number, params: {
    category?: AllCategories
    search?: string
  } = {}) => {
    try {
      const url = `${backendUrl}/get-slice`;
      const loadedIds = loadedImageItemsRef.current.map(item => item.id).join(",");

      const headers = {
        token: getToken() ?? "",
        limit: limit.toString(),
        loadedItems: loadedIds,
        ...params,
      }

      const response = await fetch(url, {
        method: "GET",
        headers
      });

      const responseData = await response.json() as {
        hasMore: boolean;
        data: ImageItem[];
      }

      const { hasMore } = responseData;

      dispatch({
        type: "SET_HAS_MORE",
        payload: {
          category: currentFilterRef.current,
          hasMore: hasMore,
        }
      })

      setHasMore(hasMore);

      return responseData;
    } catch {
      setError(true);
    }
  }

  async function renderNext(itemsToRenderCount?: number) {
    console.log("Current category", currentFilterRef.current);
    console.log("Loaded categories", loadedCategoriesRef.current);

    if (loadedCategoriesRef.current[currentFilterRef.current] === false) return;
    if (loadedCategoriesRef.current["All"] === false) return;

    console.log("Category", currentFilterRef.current, "has more items:", loadedCategoriesRef.current[currentFilterRef.current]);


    setLoading(true);
    const itemsToLoad = itemsToRenderCount ?? 9;

    const response = await fetchItems(itemsToLoad, {
      category: currentFilterRef.current,
      search: currentSearchRef.current ?? undefined
    });

    if (!response) {
      setLoading(false);
      setError(true);
      return;
    }

    const itemsToAdd = response.data;
    const hasMore = response.hasMore;

    // Note: this only causes a re-render if the states are different
    if (!currentSearchRef.current) {      
      dispatch({
        type: "SET_HAS_MORE",
        payload: {
          category: currentFilterRef.current,
          hasMore,
        }
      })
    }

    if (itemsToAdd.length) {
      // This dispatch automatically sorts the new items into the global state
      dispatch({
        type: "ADD_IMAGE_ITEMS",
        payload: itemsToAdd,
      })
    }

    setLoading(false);
  }

  return { items, loading, error, hasMore, setFilter: handleSetFilter, setSearch: handleSetSearch, renderNext }
}