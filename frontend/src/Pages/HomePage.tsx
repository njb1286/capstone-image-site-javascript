import { useSelector } from "react-redux";
import { useMemo } from "react";

import classes from "./HomePage.module.scss";

import Card from "../Components/Card";
import SearchBar from "../Components/SearchBar";
import ErrorPage from "../Components/ErrorPage";
import { ImageState } from "../store/images-store";

function HomePage() {
  const searchValue = useSelector((state: ImageState) => state.searchValue);
  const selectedCategory = useSelector((state: ImageState) => state.selectedCategory);
  const imageItems = useSelector((state: ImageState) => state.imageItems);

  const filteredImageItems = useMemo(() => {
    return imageItems.filter(item => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch = !searchValue || item.title.toLowerCase().includes(searchValue.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchValue, imageItems]);

  const content = !filteredImageItems.length ? (
    <ErrorPage message="No images found" />
  ) : (
    <div className={classes.cards}>
      {filteredImageItems.map(item => {
        return <Card {...item} key={item.id} />;
      })}
    </div>
  );

  return (
    <>
      <SearchBar />
      {content}
    </>
  );
}

export default HomePage;