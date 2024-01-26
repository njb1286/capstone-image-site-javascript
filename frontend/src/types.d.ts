// Ignore this file, it is simply type definitions, and doesn't affect the runtime in any way

import { ImageItem as _ImageItem, categories } from "./store/images-store";
import { FormEvent as _FormEvent, ChangeEvent as _ChangeEvent } from "react";

// Utilities for this file
type Optional<T extends object> = {
  [K in keyof T]?: T[K];
}

type ActionCreator<T extends Record<string, any>> = {
  [K in keyof T]: {
    type: K;
    payload: T[K];
  }
}[keyof T];

type ActionCreatorNoPayload<T extends string[]> = {
  type: T[number];
};


// Actual types
declare global {
  // Declaring native types as global
  type ImageItem = _ImageItem;
  type FormEvent = _FormEvent;
  type ChangeEvent = _ChangeEvent;


  type Category = typeof categories[number];

  type ImageState = {
    imageItems: ImageItem[],
    modalIsVisible: boolean,
    hasMoreItems: boolean,
    loadedCategories: Category[],
    token: string | null,
    initialRender: boolean,
    tempPassword: string
  }

  type ImageActions = ActionCreator<{
    SET_IMAGE_ITEMS: ImageItem[];
    ADD_IMAGE_ITEM: ImageItem;
    ADD_IMAGE_ITEMS: ImageItem[];
    UPDATE_IMAGE_ITEM: Optional<Omit<ImageItem, "date">> & { id: number };
    DELETE_IMAGE_ITEM: number;
  
    SET_MODAL_VISIBLE: boolean;
    ADD_LOADED_CATEGORY: Category;
    SET_TOKEN: string | null,
  
    SET_TEMP_PASSWORD: string;
  
  }> | ActionCreatorNoPayload<[
    "HAS_NO_MORE_ITEMS",
    "INITIAL_RENDER"
  ]>;
}