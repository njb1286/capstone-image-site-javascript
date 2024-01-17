import { Reducer } from "@reduxjs/toolkit";
import { ActionCreator } from "../../types";

export type ModalAction = ActionCreator<{
  SET_MODAL_VISIBLE: boolean;
  SET_MODAL_DATA: Pick<ModalState, "title" | "content" | "renderButtons">;
}>;

const initialState = {
  visible: false,
  title: "",
  content: "",
  renderButtons: (_onClose: () => void) => <></>
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