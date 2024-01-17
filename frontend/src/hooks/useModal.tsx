import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { ModalAction, ModalState } from "../store/modal/modal-store";

export const useModal = (title: string, content: string, renderButtons: ModalState["renderButtons"]) => {
  const dispatch = useDispatch<Dispatch<ModalAction>>();

  const setVisible = (payload: boolean) => {
    dispatch({
      type: "SET_MODAL_DATA",
      payload: {
        title,
        content,
        renderButtons,
      }
    })

    dispatch({
      type: "SET_MODAL_VISIBLE",
      payload,
    });
  }

  return setVisible;
}