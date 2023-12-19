import { useLocation } from "react-router-dom";
import classes from "./ContentPage.module.scss";
import { useSelector } from "react-redux";
import { ImageState } from "../store/images-store";
import { CardBody } from "react-bootstrap";

const viewsRegex = /.*?views\/(?<param>\w*)/g;

function ContentPage() {
  const imagesData = useSelector((state: ImageState) => state.datapacks);
  const location = useLocation();

  const id = location.pathname.replace(viewsRegex, "$<param>");

  const imageData = imagesData.find(item => item.id === id);

  if (!imageData) {
    return <h2>Hmmm... we couldn't find that image...</h2>
  }

  const {
    title,
    description,
    date,
    img,
  } = imageData;

  return (
    <CardBody className={classes.group}>
      <CardBody className={`row ${classes.body}`}>
        <div className={`col-md-6 ${classes.info} ${classes.col}`}>
          <h1 className="card-title text-center">{title}</h1>

          <p className="card-text">{description}</p>
        </div>

        <div className={`col-md-6 ${classes.col}`}>
          <img src={img} className="card-img" />
        </div>
      </CardBody>
    </CardBody>
  );
}

export default ContentPage;