import { useEffect, useRef, useState } from "react";
import LoadingPage from "../Components/LoadingPage";
import SearchBar from "../Components/SearchBar";
import classes from "./HomePage.module.scss";
import { useInfiniteLoad } from "../hooks/useInfiniteLoad";
import { backendUrl } from "../store/backend-url";
import { getToken } from "../helpers/token";
import { ImageItem } from "../store/images-store";
import Card from "../Components/Card";

const NewHomePage = () => {
  const loadingElementRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const { items, renderNext, hasMore } = useInfiniteLoad(
    fetchRequest,
    (item) => item.id,
    {
      renderCount: 10,
    }
  );

  const observer = useRef(new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    renderNext();
  }, {
    rootMargin: "0px",
    threshold: 0.1
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  // Make sure the component is mounted before observing the loading element
  useEffect(() => {
    if (!mounted) return;
    if (loadingElementRef.current) {
      observer.current.observe(loadingElementRef.current);
    }
  }, [mounted]);

  async function fetchRequest(offset: number, limit: number) {
    const loadedItems = items
      .map(item => item.id)
      // Ensure that the scope of the loaded items is within the offset and limit
      .filter(id => id >= offset && id <= offset + limit)
      .join(",");

    const response = await fetch(`${backendUrl}/get-slice?offset=${offset}&limit=${limit}`, {
      method: "GET",
      headers: {
        token: getToken() ?? "",
        loadedItems,
      }
    });

    const data = await response.json() as { hasMore: boolean, data: ImageItem[] };

    return data;
  }

  // // const [initialRendered, setInitialRendered] = useState(false);
  // const [dummy, setDummy] = useState<number[]>([]);

  // // Use a ref instead of state because state doesn't change in the intersection observer
  // const initialRendered = useRef(false);

  // const isRenderingCards = useRef(false);

  // const observer = useRef(new IntersectionObserver(([entry]) => {    
  //   if (isRenderingCards.current) return;

  //   if (!entry.isIntersecting) return;    

  //   if (!initialRendered.current) {
  //     initialRender();
  //     return;
  //   }

  //   renderNext();
  // },
  // {
  //   rootMargin: "0px",
  //   threshold: 0.1
  // }))

  // function initialRender() {
  //   isRenderingCards.current = true;
  //   initialRendered.current = true; 
  //   console.log("Initial Render"); 
  //   isRenderingCards.current = false;
  // }

  // function renderNext() {
  //   // setIsRenderingCards(true);
  //   isRenderingCards.current = true;
  //   console.log("Render next");
  // }

  // useEffect(() => {
  //   observer.current.observe(loadingElementRef.current!);

  //   setTimeout(() => {
  //     const arr: number[] = [];
  //     for (let i = 0; i < 200; i++) {
  //       arr.push(i);
  //     }
  //     setDummy(arr);
  //   }, 1000);
  // }, []);

  return (
    <>
      <SearchBar />
      <div className={classes["cards-wrapper"]}>
        {/* 
        <div className={`${classes.cards}`}>
          {dummy.map((_, index) => <h1 key={index}>{index}</h1>)}
          </div>
        */}
        <div className={classes.cards}>
          {items.map((item, index) => {
            return <Card {...item} itemIndex={index} stateToListenTo={null} key={`card_${index}`} />
          })}
        </div>
        <LoadingPage ref={loadingElementRef} fullScreen={false} className={`${classes["loading-images"]} ${classes.visible}`} />
      </div>
    </>
  )
}

export default NewHomePage;