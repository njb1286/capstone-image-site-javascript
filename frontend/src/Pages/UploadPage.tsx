import { useNavigate } from "react-router";
import { backendUrl } from "../store/backend-url";
import { useUploadForm } from "../hooks/useUploadForm";
import { Category } from "../store/images-store";
import { useAddImageItem } from "../hooks/useAddImageItem";

function UploadPage() {
  const navigate = useNavigate();
  const addImageItem = useAddImageItem();

  async function submitHandler (title: string, description: string, image: File | null, category: Category) {
    const formData = new FormData();

    formData.append("image", image!);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);

    const response = await fetch(`${backendUrl}/form`, {
      method: "POST",
      body: formData,
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