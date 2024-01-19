import { useSelector } from "react-redux";

import classes from "./HomePage.module.scss";

import Card from "../Components/Card";
import SearchBar from "../Components/SearchBar";
import { ImageState } from "../store/images-store";
import LoadingPage from "../Components/LoadingPage";

function Home() {
  const searchValue = useSelector((state: ImageState) => state.searchValue);
  const isLoadingState = useSelector((state: ImageState) => state.imageItems).length;
  const selectedCategory = useSelector((state: ImageState) => state.selectedCategory);

  const imageItems = useSelector((state: ImageState) => state.imageItems);
  let imageItemsCopy = Array.from(imageItems);

  if (searchValue || selectedCategory !== "All") {
    imageItemsCopy = Array.from(imageItems).filter(item => {
      if (selectedCategory !== "All" && selectedCategory !== item.category) {
        return false;
      }

      return item.title.toLowerCase().includes(searchValue.toLowerCase());
    });
  }

  const content = <div className={classes.cards}>{imageItemsCopy.map(item => {
    return <Card {...item} key={item.id} />
  })}</div>;

  const noImagesFoundMsg = <p className={classes["no-images"]}>No images found</p>;

  return (
    <>
      <SearchBar />

      {!imageItemsCopy.length ? noImagesFoundMsg : content}
    </>
  )
}

export default Home;