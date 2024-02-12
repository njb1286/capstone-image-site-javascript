import { useEffect, useReducer, useRef } from "react";
import { addItemsToSortedList } from "../helpers/addItemToSortedList";

type InfiniteLoadOptions<T> = {
  initialItemCount?: number;
  nextItemCount?: number;
  initialItems?: T[];
}

const defaultInfiniteLoadOptions: InfiniteLoadOptions<any> = {
  initialItemCount: 10,
  nextItemCount: 6,
  initialItems: [],
}

type InfiniteLoadState<T> = {
  items: T[];
  hasMore: boolean;
  loadingItems: boolean;
  error: boolean;
}

type FetchRequest<T> = (offset: number, limit: number) => Promise<{ hasMore: boolean, data: T[] }>;

type InfiniteLoadStateAction<T> = ActionCreator<{
  LOAD_NEXT: {
    items: T[];
    hasMore: boolean;
    selector: (item: T) => number;
  }
  SET_LOADING_ITEMS: boolean;
  SET_ERROR: boolean;
}>

const initialState: InfiniteLoadState<any> = {
  items: [],
  hasMore: true,
  loadingItems: false,
  error: false,
};

function infiniteLoadReducer<T>(state: InfiniteLoadState<T> = initialState, action: InfiniteLoadStateAction<T>): InfiniteLoadState<T> {
  switch (action.type) {
    case "LOAD_NEXT": {
      const { items, selector, hasMore } = action.payload;
      const newItems = addItemsToSortedList(state.items, items, selector);

      return {
        ...state,
        hasMore,
        items: newItems,
        loadingItems: false,
      }
    }

    case "SET_LOADING_ITEMS":
      return {
        ...state,
        loadingItems: action.payload,
      }

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      }

    default:
      return state;
  }
}

/**
 * @param fetchRequestCallback An async function that returns fetched data from the API endpoint (included in the function)
 * @param selector A selector for comparing the ids of the items in the array (takes in the item and returns a number from that item, usually the id)
 * @param options 
 * @returns 
 * 
 * API requirement: The API endpoint must return an object with a data property that is an array of items and a hasMore property that is a boolean
 */

export const useInfiniteLoad = <T>(fetchRequestCallback: FetchRequest<T>, selector: (item: T) => number, options: InfiniteLoadOptions<T> = defaultInfiniteLoadOptions) => {
  const [state, dispatch] = useReducer(infiniteLoadReducer<T>, initialState);

  const loaded = useRef(false);

  // The point of this is for safety in case the fetchRequestCallback provided by the consumer of this hook throws an error
  async function fetchRequestWrapper(offset: number, limit: number) {
    try {
      return await fetchRequestCallback(offset, limit);
    } catch {
      dispatch({
        type: "SET_ERROR",
        payload: true,
      })
      return { hasMore: false, data: [] };
    }
  }

  useEffect(() => {
    if (loaded.current) return;

    initialRender();
    loaded.current = true;
  }, []);

  async function initialRender() {
    const itemsToRenderCount = options?.initialItemCount ?? 10;

    dispatch({
      type: "SET_LOADING_ITEMS",
      payload: true
    });

    const data = await fetchRequestWrapper(0, itemsToRenderCount);

    dispatch({
      type: "LOAD_NEXT",
      payload: {
        items: data.data,
        hasMore: data.hasMore,
        selector
      }
    });
  }

  async function renderNext() {
    if (!state.hasMore) return;

    dispatch({
      type: "SET_LOADING_ITEMS",
      payload: true,
    });

    const data = await fetchRequestWrapper(state.items.length, options?.nextItemCount ?? 10);

    dispatch({
      type: "LOAD_NEXT",
      payload: {
        items: data.data,
        hasMore: data.hasMore,
        selector,
      }
    })
  }

  return { ...state, renderNext }
}