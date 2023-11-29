import { useLocation, useSearchParams } from "react-router-dom";
import classes from "./ContentPage.module.scss";
import { useSelector } from "react-redux";
import { ImageState } from "../store/images-store";

const viewsRegex = /.*?views\/(?<param>\w*)/g;

function ContentPage() {
  const imagesData = useSelector((state: ImageState) => state.datapacks);
  const location = useLocation();

  const id = location.pathname.replace(viewsRegex, "$<param>");

  const imageData = imagesData.find(item => item.id === id);

  if (!imageData) {
    return <h2>Hmmm... we could not find that image...</h2>
  }

  const {
    title,
    description,
    date,
    img,
  } = imageData;

  return (
    <div className={classes["item-wrapper"]}>
      <div className={classes.item}>
        <h2 className={classes.title}>{title}</h2>

        <img src={img} />

        <p className={classes.description}>{description}</p>
      </div>
    </div>
  );
}

export default ContentPage;