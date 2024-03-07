import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, ButtonGroup, CardBody } from "react-bootstrap";
import { useModal } from "../hooks/useModal";
import { backendUrl } from "../store/backend-url";
import classes from "./ContentPage.module.scss";
import { getToken } from "../helpers/token";
import { useLazyImage } from "../hooks/useLazyImage";
import { useGetImageItem } from "../hooks/useGetImageItem";
import LoadingPage from "../Components/LoadingPage";
import PageNotFound from "./PageNotFound";

function ContentPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = parseInt(searchParams.get("id") ?? "-1");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isError, imageItem } = useGetImageItem(id);

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

  const [component] = useLazyImage(id, imageItem ? imageItem.title : "", {
    wrapperClassName: `card-img ${classes["image-wrapper"]}`,
    defaultImageShouldLoad: true,
    imageClassName: classes.image,
    loadingImageClassName: classes["loading-image"],
  });

  if (isError) {
    return <PageNotFound message="Hmmm... we couldn't find that image" />
  }

  // Note: if the image item is null, it means that the item is still loading
  if (!imageItem) {
    return <LoadingPage />
  }

  const handleReturnHome = () => {
    navigate("/");
  }

  const handleDeleteAction = async () => {
    await fetch(`${backendUrl}/delete?id=${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": getToken(),
      }
    });

    dispatch({
      type: "DELETE_IMAGE_ITEM",
      payload: id,
    })

    handleReturnHome();
  }

  const handleDeleteBtnClick = () => {
    setDeleteModalIsVisible(true);
  }

  const handleUpdate = () => {
    navigate(`/update?id=${id}`);
  }

  const { title, description, date, category } = imageItem;

  const splitDescription = description.split("\n").map((item, index) => <li key={`${item}__${index}`}>{item} <br /></li>);

  const uploadDate = new Date(date).toLocaleDateString();

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
                <p>Category: {category}</p>
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