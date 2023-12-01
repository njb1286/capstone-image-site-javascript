import { useSelector } from "react-redux";
import classes from "./HomePage.module.scss";
import { ImageState } from "../store/images-store";
import Card from "../Components/Card";
import SearchBar from "../Components/SearchBar";

function Home() {
  const searchValue = useSelector((state: ImageState) => state.searchValue);
  
  let datapackItems = useSelector((state: ImageState) => state.datapacks);

  if (searchValue) {
    datapackItems = datapackItems.filter(item => item.title.toLowerCase().includes(searchValue.toLowerCase()));
  }

  return (
    <>
      <SearchBar />

      <div className={classes.cards}>
        {datapackItems.map(item => {
          return <Card {...item} key={item.id} />
        })}
      </div>
    </>
  )
}

export default Home;