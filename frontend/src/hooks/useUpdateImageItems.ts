import { useDispatch } from "react-redux";
import { getImageItems } from "../store/images/images-actions";
import { store } from "../store/combined-stores";

export const useUpdateImageItems = () => {
  const dispatch = useDispatch<typeof store.dispatch>();
  
  const updateImageItems = () => {
    dispatch(getImageItems());
  }

  return updateImageItems;
}