import { useEffect, useMemo, useRef, useState } from "react";
import LoadingPage from "../Components/LoadingPage";
import SearchBar from "../Components/SearchBar";
import classes from "./HomePage.module.scss";
import { AllCategories, ImageState, imageStore } from "../store/images-store";
import Card from "../Components/Card";
import { useDispatch, useSelector } from "react-redux";
import { getAllImageItems } from "../store/images-actions";
import { lowerCase } from "../helpers/case";

const NewHomePage = () => {
  const items = useSelector((state: ImageState) => state.imageItems);
  const loadedItems = useSelector((state: ImageState) => state.loadedAllItems);
  const dispatch = useDispatch<typeof imageStore.dispatch>();
  const mounted = useRef(loadedItems);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<AllCategories>("All");
  const [sortBy, setSortBy] = useState<SearchBarSort>("Date");

  useEffect(() => {
    if (loadedItems || mounted.current) return;

    mounted.current = true;
    dispatch(getAllImageItems(items.map(item => item.id).join(",")));
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filter === "All") return true;
      return item.category === filter;
    }).sort((a, b) => a[lowerCase(sortBy)].localeCompare(b[lowerCase(sortBy)]));
  }, [search, filter, items, sortBy]);

  return (
    <>
      <SearchBar onChange={setSearch} onSelectCategory={setFilter} onSelectSort={setSortBy} />
      <div className={classes["cards-wrapper"]}>
        <div className={`${classes.cards} ${classes.grid}`}>
          {filteredItems.map((item, index) => {
            return <Card {...item} stateToListenTo={items} key={`card_${index}`} />
          })}

        </div>
        <LoadingPage fullScreen={false} className={`${classes["loading-images"]} ${!loadedItems ? classes.visible : ""}`} />
      </div>
    </>
  )
}

export default NewHomePage;