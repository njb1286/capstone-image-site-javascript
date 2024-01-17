import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, ButtonGroup, CardBody } from "react-bootstrap";
import { useModal } from "../hooks/useModal";
import { ImageActions, ImageState } from "../store/images-store";
import { backendUrl } from "../store/backend-url";
import classes from "./ContentPage.module.scss";

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

  const splitDescription = description.split("\n").map((item, index) => <p key={`${item}__${index}`}>{item} <br /></p>);

  return (
    <CardBody className={classes.group}>
      {modalPortal}

      <CardBody className={`row ${classes.body}`}>
        <ButtonGroup className={classes.buttons}>
          <button className="btn btn-lg btn-warning" onClick={handleUpdate}>Edit</button>
          <button className="btn btn-lg btn-danger" onClick={handleDeleteBtnClick}>Delete</button>
        </ButtonGroup>

        <div className={`${classes.info} ${classes.col}`}>
          <img alt={title} src={`${backendUrl}/get-image?id=${id}`} className="card-img" />
          <h1 className="card-title text-center">{title}</h1>
          {splitDescription}
        </div>
      </CardBody>
    </CardBody>
  );
}

export default ContentPage;