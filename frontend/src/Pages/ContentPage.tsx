import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { CardBody } from "react-bootstrap";
import classes from "./ContentPage.module.scss";
import { ImageState } from "../store/images-store";
import { backendUrl } from "../store/backend-url";

const errorComponent = <h2>Hmmm... we couldn't find that image...</h2>;

function ContentPage() {
  const imagesData = useSelector((state: ImageState) => state.imageItems);
  const imageIsLoading = useSelector((state: ImageState) => state.isLoadingImages);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

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
      </CardBody>
    </CardBody>
  );
}

export default ContentPage;