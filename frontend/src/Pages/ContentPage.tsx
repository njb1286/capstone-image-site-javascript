import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CardBody } from "react-bootstrap";
import classes from "./ContentPage.module.scss";
import { ImageActions, ImageState } from "../store/images-store";
import { backendUrl } from "../store/backend-url";
import { Dispatch } from "@reduxjs/toolkit";

const errorComponent = <h2>Hmmm... we couldn't find that image...</h2>;

function ContentPage() {
  const imagesData = useSelector((state: ImageState) => state.imageItems);
  const imageIsLoading = useSelector((state: ImageState) => state.isLoadingImages);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch<ImageActions>>();

  if (imageIsLoading) {
    return <p>Loading...</p>;
  }

  if (!id) {
    return errorComponent;
  }

  const imageData = imagesData.find(item => item.id === +id);

  if (!imageData) {
    return errorComponent;
  }

  const handleDelete = async () => {
    await fetch(`${backendUrl}/delete?id=${id}`);

    dispatch({
      type: "DELETE_IMAGE_ITEM",
      payload: +id,
    })

    navigate("/");
  }

  const { title, description } = imageData;

  return (
    <CardBody className={classes.group}>
      <CardBody className={`row ${classes.body}`}>
        <div className={`col-md-6 ${classes.info} ${classes.col}`}>
          <h1 className="card-title text-center">{title}</h1>
          <p className="card-text">{description}</p>
        </div>
        <div className={`col-md-6 ${classes.col}`}>
          <img alt={title} src={`${backendUrl}/get-image?id=${id}`} className="card-img" />
        </div>

        <div onClick={handleDelete}>Delete</div>
      </CardBody>
    </CardBody>
  );
}

export default ContentPage;