import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import * as Category from "../types/category";
import * as Sort from "../types/sortBy";

import classes from "./HomePage.module.scss";

import Card from "../Components/Card";
import SearchBar from "../Components/SearchBar";
import { getCategoryItems, getImageSlice } from "../store/images-actions";
import LoadingPage from "../Components/LoadingPage";
import PageNotFound from "./PageNotFound";

import { backendUrl } from "../store/backend-url";
import { getToken } from "../helpers/token";

const cardHeight = 600;

function HomePage() {
  /**
   * @type {boolean}
   */
  const hasMore = useSelector(/** @param {ImageState} state */(state) => state.hasMoreItems);
  const imageItems = useSelector(/** @param {ImageState} state */(state) => state.imageItems);
  const loadedCategories = useSelector(/** @param {ImageState} state */(state) => state.loadedCategories);
  /** @type {Dispatch<ImageActions>} */
  const dispatch = useDispatch();
  const [loadingImages, setLoadingImages] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(Category.ALL);

  const [selectedSort, setSelectedSort] = useState(Sort.DATE);
  const isInitialRender = useSelector(/** @param {ImageState} state */(state) => state.initialRender);
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

  /**
   * @param {HTMLElement} element
   */
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

  /**
   * @param {number} cardsInHeight 
   */
  const initialRender = async (cardsInHeight) => {
    dispatch({
      type: "INITIAL_RENDER",
    })

    cardsRendered.current = cardsInHeight + cardsOverflowCount.current;

    setLoadingImages(true);

    dispatch(getImageSlice(0, cardsRendered.current, undefined, imageItems.map(item => item.id)));

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

      dispatch(getCategoryItems(selectedCategory, loadedItems));

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

  // Reobserve
  useEffect(() => {
    const func = async () => {
      if (searchValue) {
        try {
          const loadedIds = imageItems.map(item => item.id).join(",");

          const response = await fetch(`${backendUrl}/search?q=${searchValue}`, {
            method: "GET",
            headers: {
              token: getToken() ?? "",
              loadedItems: loadedIds,
            }
          });

          /** @type {ImageItem[]} */
          const data = await response.json();

          if (data.length) {
            dispatch({
              type: "ADD_IMAGE_ITEMS",
              payload: data,
            })
          }
        } catch {
          // Do nothing
        }
      }

      if (loadingPageRef.current) {
        observer.current.unobserve(loadingPageRef.current);
        observer.current.observe(loadingPageRef.current);
      }
    }

    func();
  }, [searchValue]);

  useEffect(() => {
    if (!hasMore) return;

    if (loadingPageRef.current) {
      observer.current.observe(loadingPageRef.current);
    }

    updateCardData();

    if (cardsRef.current) {
      const cardCount = getCardsInView(cardsRef.current);

      if (!isInitialRender && mounted) initialRender(cardCount);

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
      if (selectedSort === Sort.TITLE) {
        return a.title.localeCompare(b.title);
      }

      if (selectedSort === Sort.CATEGORY) {
        return a.category.localeCompare(b.category);
      }

      if (selectedSort === Sort.DATE) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }

      return a.id - b.id;
    });

    return (selectedCategory === Category.ALL && !searchValue) ? imageItemsCopy : imageItemsCopy.filter(item => {
      const matchesCategory = selectedCategory === Category.ALL || item.category === selectedCategory;
      const matchesSearch = !searchValue || item.title.toLowerCase().includes(searchValue.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchValue, imageItems, selectedSort]);

  const hasNoImageItems = !filteredImageItems.length && !loadingImages;

  const content = hasNoImageItems ? (
    <PageNotFound message="No images were found!" />
  ) : (
    <>
      {filteredImageItems.map((item) => {
        return <Card stateToListenTo={selectedSort} key={item.id} {...item} />;
      })}

    </>
  );

  return (
    <>
      <SearchBar
        onSelectCategory={setSelectedCategory}
        onChange={setSearchValue}
        onSelectSort={setSelectedSort}
      />
      <div className={classes["cards-wrapper"]}>
        <div className={`${classes.cards} ${hasNoImageItems ? "" : classes.grid}`} ref={cardsRef}>
          {content}
          <LoadingPage ref={loadingPageRef} fullScreen={false} className={`${classes["loading-images"]} ${hasMore && selectedCategory === "All" && !searchValue ? classes.visible : ""}`} />
        </div>
      </div>
    </>
  );
}

export default HomePage;