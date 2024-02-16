import { useEffect, useReducer, useRef, useState } from "react";
import { addItemsToSortedList } from "../helpers/addItemToSortedList";

type InfiniteLoadOptions<T> = {
  renderCount?: number;
  initialItems?: T[];
}

type FilterItem<T> = {
  renderedCount: number;

}

// useInfiniteLoad(fetchRequest, fetchCallback, { renderCount, initialItems, <T>(filterItem) => T })

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
  SET_ITEMS: T[];
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

    case "SET_ITEMS":      
      return {
        ...state,
        items: action.payload,
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

export const useInfiniteLoad = <T>(fetchRequestCallback: FetchRequest<T>, selector: (item: T) => number, options: InfiniteLoadOptions<T> = {
  renderCount: 10,
  initialItems: undefined,
}) => {

  const [state, dispatch] = useReducer(infiniteLoadReducer<T>, {
    ...initialState,
    items: options.initialItems ?? [],
  });
  
  const [cardRenderCount, setCardRenderCount] = useState(options?.renderCount ?? 10);

  const localRenderCount = useRef(cardRenderCount);

  useEffect(() => {
    localRenderCount.current = cardRenderCount;
  }, [cardRenderCount]);

  /* 
    The reason for using a ref instead of state is because the state doesn't change on update
    inside the renderNext function, so we update the value in a ref instead
  */
  const loadedItems = useRef(0);
  const initialRendered = useRef(false);

  useEffect(() => {
    loadedItems.current = state.items.length;
  }, [state.items]);
  
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

  async function initialRender(renderCount?: number) {
    dispatch({
      type: "SET_LOADING_ITEMS",
      payload: true,
    });    

    const data = await fetchRequestWrapper(loadedItems.current, renderCount ?? localRenderCount.current);        

    dispatch({
      type: "LOAD_NEXT",
      payload: {
        items: data.data,
        hasMore: data.hasMore,
        selector,
      }
    })

    initialRendered.current = true;
  }

  async function renderNext() {
    if (!state.hasMore && !state.loadingItems) return;
    if (!initialRendered.current) return;    

    dispatch({
      type: "SET_LOADING_ITEMS",
      payload: true,
    });    

    const data = await fetchRequestWrapper(loadedItems.current, localRenderCount.current);        

    dispatch({
      type: "LOAD_NEXT",
      payload: {
        items: data.data,
        hasMore: data.hasMore,
        selector,
      }
    })
  }

  return { ...state, renderNext, setCardRenderCount, initialRender }
}