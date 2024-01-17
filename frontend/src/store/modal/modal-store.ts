import { Reducer, configureStore } from "@reduxjs/toolkit";
import { ActionCreator } from "../../types";

type ModalAction = ActionCreator<{
  SET_MODAL_VISIBLE: boolean;
  SET_MODAL_DATA: Pick<ModalState, "title" | "content">;
}>;

const initialState = {
  visible: false,
  title: "",
  content: "",
}

export type ModalState = typeof initialState;

export const modalReducer: Reducer<ModalState, ModalAction> = (state = initialState, action: ModalAction) => {
  switch (action.type) {
    case "SET_MODAL_VISIBLE":
      return {
        ...state,
        visible: action.payload,
      }

    case "SET_MODAL_DATA":
      return {
        ...state,
        ...action.payload,
      }

    default:
      return state;
  }
}

export const modalStore = configureStore({
  reducer: modalReducer,
})