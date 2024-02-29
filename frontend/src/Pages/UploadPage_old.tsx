import { useNavigate } from "react-router";
import { backendUrl } from "../store/backend-url";
import { useAddImageItem } from "../hooks/useAddImageItem";
import { getRequestData, getToken } from "../helpers/token";
import { useDispatch } from "react-redux";
import { Category, ImageActions } from "../types";
import UploadForm from "../Components/UploadForm";

function UploadPage() {
  const navigate = useNavigate();
  const addImageItem = useAddImageItem();
  const dispatch = useDispatch<Dispatch<ImageActions>>();

  async function submitHandler(title: string, description: string, image: File, category: Category) {
    const formData = new FormData();

    formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);

    const response = await fetch(`${backendUrl}/form`, {
      body: formData,
      ...getRequestData("POST")
    });

    if (response.status > 299) {
      errorHandler();
      return;
    }

    /** @type {{message: string, id: number, date: string}} */
    const data = await response.json();

    /* While making this, I realized I could get the ID in the same request instead of using another request to get the last item */
    // addImageItem();


    dispatch({
      type: "ADD_IMAGE_ITEM",
      payload: {
        title,
        description,
        category,
        id: data.id,
        date: data.date
      }
    })
    navigate("/");
  }

  // const [uploadForm, errorHandler] = useUploadForm({
  //   updating: false,
  //   onSubmit: submitHandler,
  // });

  // return uploadForm;
  return <UploadForm />
}

export default UploadPage;