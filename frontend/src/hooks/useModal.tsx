import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { ModalAction } from "../store/modal/modal-store";

export const useModal = (title: string, content: string) => {
  const dispatch = useDispatch<Dispatch<ModalAction>>();

  const setVisible = (payload: boolean) => {
    dispatch({
      type: "SET_MODAL_DATA",
      payload: {
        title,
        content
      }
    })

    dispatch({
      type: "SET_MODAL_VISIBLE",
      payload,
    });
  }

  return [setVisible] as const;
}