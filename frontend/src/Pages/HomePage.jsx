import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";

import classes from "./HomePage.module.scss";

import Card from "../Components/Card";
import SearchBar from "../Components/SearchBar";
import ErrorPage from "../Components/ErrorPage";
import { getCategoryItems, getImageSlice } from "../store/images-actions";
import LoadingPage from "../Components/LoadingPage";

const cardHeight = 600;

function HomePage() {
  const hasMore = useSelector((state) => state.hasMoreItems);
  const imageItems = useSelector((state) => state.imageItems);
  const loadedCategories = useSelector((state) => state.loadedCategories);
  const dispatch = useDispatch();
  const [loadingImages, setLoadingImages] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Date");
  const isInitialRender = useSelector((state) => state.initialRender);
  const loadingPageRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const observer = useRef(new IntersectionObserver(([entries]) => {
    if (entries.isIntersecting && !loadingImages) {
      renderNextCards();
    }
  }, {
    root: null,
    rootMargin: "20px",
    threshold: 0.1,
  }));

  const cardsRef = useRef(null);

  const cardsPerRow = useRef(3);
  const cardsOverflowCount = useRef(6);
  const cardsRendered = useRef(0);
  const loadedImages = useRef(imageItems.map(item => item.id));

  function getCardsInView(element) {
    const result = Math.max(Math.ceil(element.clientHeight / cardHeight * cardsPerRow.current), cardsPerRow.current);

    return Math.ceil(result / 3) * 3;
  }

  const updateCardData = () => {
    if (window.innerWidth < 768) {
      cardsPerRow.current = 1;
      cardsOverflowCount.current = 3;
      return;
    }

    cardsPerRow.current = 3;
    cardsOverflowCount.current = 6;
  }

  const initialRender = async (cardsInHeight) => {
    dispatch({
      type: "INITIAL_RENDER",
    })

    cardsRendered.current = cardsInHeight + cardsOverflowCount.current;

    setLoadingImages(true);

    await dispatch(getImageSlice(0, cardsRendered.current, undefined, imageItems.map(item => item.id)));

    setLoadingImages(false);
  }

  const renderNextCards = () => {
    const doneLoading = () => {
      setLoadingImages(false);
    }

    dispatch(getImageSlice(cardsRendered.current, cardsOverflowCount.current, doneLoading, loadedImages.current));

    cardsRendered.current += cardsOverflowCount.current;
  }

  const resizeHandler = () => {
    updateCardData();
  }

  useEffect(() => {
    const fn = async () => {
      if (!hasMore) return;

      if (selectedCategory === "All") return;

      if (loadedCategories.includes(selectedCategory)) return;

      setLoadingImages(true);

      const loadedItems = imageItems.filter(item => item.category === selectedCategory).map(item => item.id);

      await dispatch(getCategoryItems(selectedCategory, loadedItems));

      setLoadingImages(false);
    }

    fn();
  }, [selectedCategory]);
  
  /* 
    For tracking if the component has mounted,
    for making sure that the elements are rendered
    so the observer can observe them 
  */
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMore) return;

    if (loadingPageRef.current) {
      observer.current.observe(loadingPageRef.current);
    }

    updateCardData();

    if (cardsRef.current) {
      const cardCount = getCardsInView(cardsRef.current);

      if (!isInitialRender) initialRender(cardCount);

      updateCardData();

      window.addEventListener("resize", resizeHandler);
    }

    return () => {
      window.removeEventListener("resize", resizeHandler);
      if (loadingPageRef.current) {
        observer.current.unobserve(loadingPageRef.current);
      }
    }
  }, [mounted]);


  const filteredImageItems = useMemo(() => {
    const imageItemsCopy = [...imageItems].sort((a, b) => {
      if (selectedSort === "Title") {
        return a.title.localeCompare(b.title);
      }

      if (selectedSort === "Category") {
        return a.category.localeCompare(b.category);
      }

      if (selectedSort === "Date") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }

      return a.id - b.id;
    });

    return (selectedCategory === "All" && !searchValue) ? imageItemsCopy : imageItemsCopy.filter(item => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch = !searchValue || item.title.toLowerCase().includes(searchValue.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchValue, imageItems, selectedSort]);

  const content = !filteredImageItems.length && !loadingImages ? (
    <ErrorPage message="No images found" />
  ) : (
    <>
      {filteredImageItems.map((item) => {
        return <Card stateToListenTo={selectedSort} {...item} key={item.id} />;
      })}
      <LoadingPage ref={loadingPageRef} fullScreen={false} className={`${classes["loading-images"]} ${hasMore && selectedCategory === "All" && !searchValue ? classes.visible : ""}`} />
    </>
  );

  return (
    <>
      <SearchBar
        onSelectCategory={setSelectedCategory}
        onChange={setSearchValue}
        onSelectSort={setSelectedSort}
      />
      <div className={classes.cards} ref={cardsRef}>
        {content}
      </div>
    </>
  );
}

export default HomePage;