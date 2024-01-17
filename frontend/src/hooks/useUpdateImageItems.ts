import { useDispatch } from "react-redux";
import { getImageItems } from "../store/images/images-actions";
import { imageStore } from "../store/images/images-store";

export const useUpdateImageItems = () => {
  const dispatch = useDispatch<typeof imageStore.dispatch>();
  
  const updateImageItems = () => {
    dispatch(getImageItems());
  }

  return updateImageItems;
}