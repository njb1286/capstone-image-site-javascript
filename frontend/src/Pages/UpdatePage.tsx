import { useDispatch } from "react-redux";
import { getToken } from "../helpers/token";
import { backendUrl } from "../store/backend-url";
import UploadForm from "../Components/UploadForm";
import { ImageActions, Category } from "../types";
import { useNavigate } from "react-router";
import PageNotFound from "./PageNotFound";
import { useGetImageItem } from "../hooks/useGetImageItem";
import { useMemo } from "react";

const UpdatePage = () => {
  const query = new URLSearchParams(window.location.search);
  const idStr = query.get("id");
  const id = parseInt(idStr ?? "-1");
  const redirectRoute = useMemo(() => `/views?id=${id}`, [id]);

  const { imageItem } = useGetImageItem(id);

  const dispatch = useDispatch<Dispatch<ImageActions>>();
  const navigate = useNavigate();

  if (!imageItem) {
    return <PageNotFound message={"Sorry, we couldn't find that item!"} hasLink />
  }
  
  const { title, description, category } = imageItem;

  const submitHandler = async (formData: FormData) => {
    const response = await fetch(`${backendUrl}/update?id=${id}`, {
      method: "PUT",
      body: formData,
      headers: {
        "Authorization": getToken(),
      }
    });

    if (response.status > 299) {
      return true;
    }

    const newTitle = formData.get("title") as string;
    const newDescription = formData.get("description") as string;
    const newCategory = formData.get("category") as Category;

    dispatch({
      type: "UPDATE_IMAGE_ITEM",
      payload: {
        title: newTitle,
        description: newDescription,
        id,
        category: newCategory
      }
    })

    navigate(redirectRoute);
  }

  const cancelHandler = () => {
    navigate(redirectRoute);
  }  

  return (
    <UploadForm 
      onCancel={cancelHandler} 
      onSubmit={submitHandler} 
      defaultTitle={title} 
      defaultDescription={description} 
      defaultCategory={category} 
      validateFieldsOnMount
      shouldNotValidateImage
    />
  )
}

export default UpdatePage;