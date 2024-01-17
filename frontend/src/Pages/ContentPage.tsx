import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, ButtonGroup, CardBody } from "react-bootstrap";
import classes from "./ContentPage.module.scss";
import { ImageActions, ImageState } from "../store/images-store";
import { backendUrl } from "../store/backend-url";
import { useModal } from "../hooks/useModal";

export const errorComponent = <h2>Hmmm... we couldn't find that image...</h2>;

function ContentPage() {
  const imagesData = useSelector((state: ImageState) => state.imageItems);
  const imageIsLoading = useSelector((state: ImageState) => state.isLoadingImages);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [modalPortal, setDeleteModalIsVisible] = useModal("Delete Image", "Are you sure you want to delete this image?", (closeHandler) => {
    return (
      <>
        <Button className="btn btn-lg btn-warning" onClick={closeHandler}>Cancel</Button>
        <Button className="btn btn-lg btn-danger" onClick={() => {
          handleDeleteAction();
          closeHandler();
        }}>Delete</Button>
      </>
    );
  
  });

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

  const handleDeleteAction = async () => {
    await fetch(`${backendUrl}/delete?id=${id}`);

    dispatch<ImageActions>({
      type: "DELETE_IMAGE_ITEM",
      payload: +id,
    })

    handleReturnHome();
  }

  const handleDeleteBtnClick = () => {
    setDeleteModalIsVisible(true);
  }

  const handleUpdate = () => {
    navigate(`/update?id=${id}`);
  }

  const { title, description } = imageData;

  return (
    <CardBody className={classes.group}>
      {modalPortal}

      <CardBody className={`row ${classes.body}`}>
        <ButtonGroup className={classes.buttons}>
          <button className="btn btn-lg btn-warning" onClick={handleUpdate}>Edit</button>
          <button className="btn btn-lg btn-danger" onClick={handleDeleteBtnClick}>Delete</button>
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