import { useEffect, useRef, useState } from "react";
import LoadingPage from "../Components/LoadingPage";
import SearchBar from "../Components/SearchBar";
import classes from "./HomePage.module.scss";
import { useInfiniteLoad } from "../hooks/useInfiniteLoad";
import { backendUrl } from "../store/backend-url";
import { getToken } from "../helpers/token";
import { AllCategories, ImageItem } from "../store/images-store";
import Card from "../Components/Card";
import { useConsecutiveLoad } from "../hooks/useConsecutiveLoad";

const cardHeight = 600;
const cardWidth = 455;

const NewHomePage = () => {
  const loadingElementRef = useRef<HTMLDivElement>(null);
  const cardsElementRef = useRef<HTMLDivElement>(null);
  // const [mounted, setMounted] = useState(false);

  const { items, renderNext, hasMore, setSearch, setFilter } = useConsecutiveLoad(loadingElementRef, cardsElementRef, { defaultCategory: "All" });

  const searchBarChangeHandler = (value: string) => {
    setSearch(value);
  }

  const filterChangeHandler = (category: AllCategories) => {
    setFilter(category);
  }

  return (
    <>
      <SearchBar onChange={searchBarChangeHandler} onSelectCategory={filterChangeHandler} />
      <div className={classes["cards-wrapper"]} ref={cardsElementRef}>
        <div className={`${classes.cards} ${classes.grid}`}>
          {items.map((item, index) => {
            return <Card {...item} itemIndex={index} stateToListenTo={items} key={`card_${index}`} />
          })}
        </div>
        <LoadingPage ref={loadingElementRef} fullScreen={false} className={`${classes["loading-images"]} ${hasMore ? classes.visible : ""}`} />
      </div>
    </>
  )
}

export default NewHomePage;