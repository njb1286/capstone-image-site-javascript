import { useDispatch } from "react-redux";
import { getToken } from "../helpers/token";
import { backendUrl } from "../store/backend-url";
import UploadForm from "../Components/UploadForm";
import { ImageActions, Category } from "../types";
import { useNavigate } from "react-router";

type UploadPageProps = {
  redirect?: string;
}

const UploadPage = (props: UploadPageProps) => {
  const dispatch = useDispatch<Dispatch<ImageActions>>();
  const navigate = useNavigate();

  const submitHandler = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as Category;

    console.log("Title", title);
    console.log("Description", description);
    console.log("Category", category);
    console.log("Image", formData.get("image"));
    
    
    const response = await fetch(`${backendUrl}/form`, {
      method: "POST",
      body: formData,
      headers: {
        token: getToken() ?? ""
      }
    });

    if (response.status > 299) {
      return true;
    }

    const data = await response.json() as { message: string, id?: number, date?: string };

    if (!data.id || !data.date) {
      return true;
    }

    const id = data.id;
    const date = data.date;

    dispatch({
      type: "ADD_IMAGE_ITEM",
      payload: {
        title,
        description,
        id,
        date,
        category
      }
    });

    if (props.redirect) {
      navigate(props.redirect);
    }
  }

  return <UploadForm onSubmit={submitHandler} />
}

export default UploadPage;