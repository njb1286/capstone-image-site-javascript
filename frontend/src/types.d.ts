// Ignore this file, it is simply type definitions, and doesn't affect the runtime in any way

import { ImageItem as _ImageItem } from "./store/images-store";
import {
  FormEvent as _FormEvent,
  ChangeEvent as _ChangeEvent,
  MouseEvent as _MouseEvent,
  MutableRefObject as _MutableRefObject,
  ReactPortal as _ReactPortal,
  Dispatch as _ReactDispatch,
  SetStateAction as _SetStateAction,
} from "react";
import { Action, Dispatch as _Dispatch } from "@reduxjs/toolkit";
import { FormControlProps as _FormControlProps } from "react-bootstrap";

const categories = ["Animals", "Architecture", "Food", "Nature", "Other", "People", "Sports", "Technology", "Travel"] as const;
export type Category = typeof categories[number];

declare global {
  // Utilities for this file
  type Optional<T extends object> = {
    [K in keyof T]?: T[K];
  }

  export type ActionCreator<T extends Record<string, any>> = {
    [K in keyof T]: {
      type: K;
      payload: T[K];
    }
  }[keyof T];

  type ActionCreatorNoPayload<T extends string[]> = {
    type: T[number];
  };


  // Declaring native types as global
  type ImageItem = _ImageItem;
  type FormEvent<T extends HTMLElement = HTMLFormElement> = _FormEvent;
  type ChangeEvent = _ChangeEvent;
  type ReactMouseEvent<T = Element, U = MouseEvent> = _MouseEvent<T, U>;
  type MutableRefObject<T extends HTMLElement> = _MutableRefObject<T>;
  type Dispatch<T extends Action> = _Dispatch<T>;
  type ReactDispatch<T> = _ReactDispatch<T>;
  type SetStateAction<T> = _SetStateAction<T>;
  type ReactPortal = _ReactPortal;
  type FormControlProps = _FormControlProps;


  // Types
  
  type SearchBarCategory = Category | "All";
  type SearchBarSort = "Date" | "Title" | "Category";

  type ImageState = {
    imageItems: ImageItem[],
    modalIsVisible: boolean,
    hasMoreItems: boolean,
    loadedCategories: Category[],
    token: string | null,
    initialRender: boolean,
    tempPassword: string
  }

  export type ImageActions = ActionCreator<{
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