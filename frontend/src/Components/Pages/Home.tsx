import { useSelector } from "react-redux";
import classes from "./Home.module.scss";
import { ImageState } from "../../store/images-store";
import Card from "../Helpers/Card";

function Home() {
  const datapackItems = useSelector((state: ImageState) => state.datapacks);

  return (
    <div className={classes.cards}>
      {datapackItems.map(item => {
        return <Card {...item} key={item.id} />
      })}      
    </div>
  )
}

export default Home;