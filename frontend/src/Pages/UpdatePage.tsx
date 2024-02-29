import { useDispatch } from "react-redux";
import { getToken } from "../helpers/token";
import { backendUrl } from "../store/backend-url";
import UploadForm from "../Components/UploadForm";
import { ImageActions, Category } from "../types";
import { useNavigate } from "react-router";
import PageNotFound from "./PageNotFound";
import { useGetImageItem } from "../hooks/useGetImageItem";

type UploadPageProps = {
  redirect?: string;
}

const UpdatePage = (props: UploadPageProps) => {
  const query = new URLSearchParams(window.location.search);
  const idStr = query.get("id");
  const id = parseInt(idStr ?? "-1");

  const { imageItem } = useGetImageItem(id);

  const dispatch = useDispatch<Dispatch<ImageActions>>();
  const navigate = useNavigate();

  if (!imageItem) {
    return <PageNotFound message={"Sorry, we couldn't find that item!"} hasLink />
  }
  
  const { title, description, category } = imageItem;

  const submitHandler = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as Category;    
    
    const response = await fetch(`${backendUrl}/update`, {
      method: "POST",
      body: formData,
      headers: {
        token: getToken() ?? ""
      }
    });

    if (response.status > 299) {
      return true;
    }

    dispatch({
      type: "UPDATE_IMAGE_ITEM",
      payload: {
        title,
        description,
        id,
        category
      }
    })

    if (props.redirect) {
      navigate(props.redirect);
    }
  }

  return <UploadForm onSubmit={submitHandler} defaultTitle={title} defaultDescription={description} defaultCategory={category} validateFieldsOnMount />
}

export default UpdatePage;