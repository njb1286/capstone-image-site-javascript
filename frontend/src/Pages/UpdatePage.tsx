import { useSelector } from "react-redux";
import { ImageState } from "../store/images-store";
import { errorComponent } from "./ContentPage";
import UploadForm from "../Components/UploadForm";

function UpdatePage() {
  const searchParams = new URLSearchParams(location.search);
  const selector = useSelector((state: ImageState) => state.imageItems);

  const id = searchParams.get("id");

  if (!id) {
    return errorComponent;
  }

  const imageData = selector.find(item => item.id === +id);

  if (!imageData) {
    return errorComponent;
  }

  return (
    <UploadForm initialUpload={false} title={imageData.title} description={imageData.description} />
  )
}

export default UpdatePage;