import { useEffect, useMemo, useRef, useState } from "react";
import LoadingPage from "../Components/LoadingPage";
import SearchBar from "../Components/SearchBar";
import classes from "./HomePage.module.scss";
import { AllCategories, ImageState, imageStore } from "../store/images-store";
import Card from "../Components/Card";
import { useDispatch, useSelector } from "react-redux";
import { getAllImageItems } from "../store/images-actions";

const NewHomePage = () => {
  const items = useSelector((state: ImageState) => state.imageItems);
  const loadedItems = useSelector((state: ImageState) => state.loadedAllItems);
  const dispatch = useDispatch<typeof imageStore.dispatch>(); 
  const mounted = useRef(loadedItems);

  useEffect(() => {
    if (loadedItems || mounted.current) return;
    
    mounted.current = true;    
    dispatch(getAllImageItems());
  }, []);
  
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<AllCategories>("All");

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filter === "All") return true;
      return item.category === filter;
    })
  }, [search, filter, items]);

  return (
    <>
      <SearchBar onChange={setSearch} onSelectCategory={setFilter} />
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