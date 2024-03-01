import { backendUrl } from "../store/backend-url";
import { useNavigate } from "react-router";
import { useUploadForm } from "../hooks/useUploadForm";
import { useGetImageItem } from "../hooks/useGetImageItem";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRequestData } from "../helpers/token";

function UpdatePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(location.search);

  const id = searchParams.get("id");

  /**
   * @type {ImageItem | undefined}
   */

  const imageItem = useSelector((state) => id ? state.imageItems.find(item => item.id === +id) : undefined);

  const getImageItem = useGetImageItem(id);
  const [uploadForm, errorHandler, setFormFields] = useUploadForm({
    id: +id,
    onSubmit: submitHandler,
    updating: true,
    title: getImageItem.type === "IMAGE_ITEM" ? getImageItem.payload.title : "",
    description: getImageItem.type === "IMAGE_ITEM" ? getImageItem.payload.description : "",
    category: getImageItem.type === "IMAGE_ITEM" ? getImageItem.payload.category : "Other",
  });

  useEffect(() => {
    if (!imageItem) return;

    setFormFields(imageItem.title, imageItem.description, imageItem.category);
  }, [imageItem]);

  if (getImageItem.type === "COMPONENT") {
    return getImageItem.payload;
  }


  /**
   * 
   * @param {string} title 
   * @param {string} description 
   * @param {File | null} image 
   * @param {Category} category 
   * @returns 
   */
  async function submitHandler(title, description, image, category) {

    const formData = new FormData();

    formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("id", id);
    formData.append("category", category);

    const response = await fetch(`${backendUrl}/update?id=${id}`, {
      body: formData,
      ...getRequestData("POST")
    });

    if (response.status > 299) {
      errorHandler();
      return;
    }

    // Note: because the ID is generated by the database, we need to reload the items
    // updateImagesState();

    dispatch({
      type: "UPDATE_IMAGE_ITEM",
      payload: {
        id: +id,
        title,
        description,
        category,
      }
    })
    navigate(`/views?id=${id}`);
  }

  return uploadForm;
}

export default UpdatePage;