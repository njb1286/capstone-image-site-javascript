import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ButtonGroup, CardBody } from "react-bootstrap";
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

  const handleReturnHome = () => {
    navigate("/");
  }

  const handleDelete = async () => {
    await fetch(`${backendUrl}/delete?id=${id}`);

    dispatch({
      type: "DELETE_IMAGE_ITEM",
      payload: +id,
    })

    handleReturnHome();
  }

  const { title, description } = imageData;

  return (
    <CardBody className={classes.group}>

      <CardBody className={`row ${classes.body}`}>
        <ButtonGroup className={classes.buttons}>
          <button className="btn btn-lg btn-primary" onClick={handleReturnHome}>Back</button>
          <button className="btn btn-lg btn-warning" onClick={() => navigate("/")}>Edit</button>
          <button className="btn btn-lg btn-danger" onClick={handleDelete}>Delete</button>
        </ButtonGroup>
        <div className={`col-md-5 ${classes.info} ${classes.col}`}>
          <h1 className="card-title text-center">{title}</h1>
          <p className="card-text">{description}</p>
        </div>
        <div className={`col-md-7 ${classes.col}`}>
          <img alt={title} src={`${backendUrl}/get-image?id=${id}`} className="card-img" />
        </div>
      </CardBody>
    </CardBody>
  );
}

export default ContentPage;