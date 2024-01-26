import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, ButtonGroup, CardBody } from "react-bootstrap";
import { useModal } from "../hooks/useModal";
import { backendUrl } from "../store/backend-url";
import classes from "./ContentPage.module.scss";
import { useGetImageItem } from "../hooks/useGetImageItem";
import { getRequestData } from "../helpers/token";
import { useLazyImage } from "../hooks/useLazyImage";

function ContentPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getImageItem = useGetImageItem(id);

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

  const [component] = useLazyImage({
    id: +id,
    title: "title" in getImageItem.payload ? getImageItem.payload.title : "",
    wrapperClassName: `card-img ${classes["image-wrapper"]}`,
    defaultImageShouldLoad: true,
    imageClassName: classes.image,
    loadingImageClassName: classes["loading-image"],
  });

  if (getImageItem.type === "COMPONENT") {
    return getImageItem.payload;
  }

  const handleReturnHome = () => {
    navigate("/");
  }

  const handleDeleteAction = async () => {
    await fetch(`${backendUrl}/delete?id=${id}`, getRequestData("DELETE"));

    dispatch({
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

  const imageData = getImageItem.payload;

  const { title, description } = imageData;

  const splitDescription = description.split("\n").map((item, index) => <li key={`${item}__${index}`}>{item} <br /></li>);

  const uploadDate = new Date(imageData.date).toLocaleDateString();

  return (
    <CardBody className={classes.group}>
      {modalPortal}

      <CardBody className={`row ${classes.body}`}>
        <div className={`${classes.info} ${classes.col}`}>
          {component}
          <h1 className={`card-title text-center ${classes.title}`}>{title}</h1>

          <div className="container">
            <div className="row my-4">
              <div className="col-md-6">
                <p>Uploaded: {uploadDate}</p>
              </div>
              <div className="col-md-6">
                <p>Category: {imageData.category}</p>
              </div>
            </div>
          </div>

          <ul className={classes.description}>{splitDescription}</ul>
        </div>


      </CardBody>
      
      <ButtonGroup className={classes.buttons}>
        <button className="btn btn-lg btn-primary" onClick={handleUpdate}>Edit</button>
        <button className="btn btn-lg btn-danger" onClick={handleDeleteBtnClick}>Delete</button>
      </ButtonGroup>
    </CardBody >
  );
}

export default ContentPage;