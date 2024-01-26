import { useNavigate } from "react-router";
import { backendUrl } from "../store/backend-url";
import { useUploadForm } from "../hooks/useUploadForm";
import { Category } from "../store/images-store";
import { useAddImageItem } from "../hooks/useAddImageItem";
import { getRequestData } from "../helpers/token";

function UploadPage() {
  const navigate = useNavigate();
  const addImageItem = useAddImageItem();

  /**
   * 
   * @param {string} title
   * @param {string} description 
   * @param {File} image 
   * @param {Category} category 
   */
  async function submitHandler (title, description, image, category) {
    const formData = new FormData();

    formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);

    const response = await fetch(`${backendUrl}/form`, {
      body: formData,
      ...getRequestData("POST"),
    });

    if (response.status > 299) {
      errorHandler();
      return;
    }

    addImageItem();
    navigate("/");
  }

  const [uploadForm, errorHandler] = useUploadForm({
    updating: false,
    onSubmit: submitHandler,
  });

  return uploadForm;
}

export default UploadPage;