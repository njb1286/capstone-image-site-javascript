import { useMemo, useState } from "react";
import LoadingPage from "../Components/LoadingPage";
import SearchBar from "../Components/SearchBar";
import classes from "./HomePage.module.scss";
import { AllCategories, ImageState } from "../store/images-store";
import Card from "../Components/Card";
import { useSelector } from "react-redux";
import { useGetAllItems } from "../hooks/useGetAllItems";

const NewHomePage = () => {
  const items = useSelector((state: ImageState) => state.imageItems);
  const loading = useGetAllItems();
  
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
        <LoadingPage fullScreen={false} className={`${classes["loading-images"]} ${loading ? classes.visible : ""}`} />
      </div>
    </>
  )
}

export default NewHomePage;