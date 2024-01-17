import { useSelector } from "react-redux";

import classes from "./HomePage.module.scss";

import Card from "../Components/Card";
import SearchBar from "../Components/SearchBar";
import { StoreState } from "../store/combined-stores";

function Home() {
  const searchValue = useSelector((state: StoreState) => state.images.searchValue);

  const isLoadingState = useSelector((state: StoreState) => state.images.isLoadingImages);
  let imageItems = useSelector((state: StoreState) => state.images.imageItems);

  if (searchValue) {
    imageItems = imageItems.filter(item => item.title.toLowerCase().includes(searchValue.toLowerCase()));
  }

  let content: JSX.Element | JSX.Element[] = <p>Loading...</p>;

  if (!isLoadingState) {
    content = imageItems.map(item => {
      return <Card {...item} key={item.id} />
    })
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