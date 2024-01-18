import { useSelector } from "react-redux";

import classes from "./HomePage.module.scss";

import Card from "../Components/Card";
import SearchBar from "../Components/SearchBar";
import { ImageState } from "../store/images-store";

function Home() {
  const searchValue = useSelector((state: ImageState) => state.searchValue);

  const isLoadingState = useSelector((state: ImageState) => state.isLoadingImages);
  let imageItems = useSelector((state: ImageState) => state.imageItems);

  if (searchValue) {
    imageItems = imageItems.filter(item => item.title.toLowerCase().includes(searchValue.toLowerCase()));
  }

  let content: JSX.Element | JSX.Element[] = <p>Loading...</p>;

  if (!isLoadingState) {
    content = imageItems.map(item => {
      return <Card {...item} key={item.id} />
    })
  }

  if (!imageItems.length) {
    return <p className={classes["no-images"]}>No images found. Go to the Upload page to start uploading</p>
  }

  return (
    <>
      <SearchBar />

      <div className={classes.cards}>
        {content}
      </div>
    </>
  )
}

export default Home;