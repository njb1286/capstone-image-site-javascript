import { useEffect, useRef, useState } from "react";
import LoadingPage from "../Components/LoadingPage";
import SearchBar from "../Components/SearchBar";
import classes from "./HomePage.module.scss";
import { useInfiniteLoad } from "../hooks/useInfiniteLoad";
import { backendUrl } from "../store/backend-url";
import { getToken } from "../helpers/token";
import { ImageItem } from "../store/images-store";

// const cardHeight = 600;

const NewHomePage = () => {
  const loadingElementRef = useRef<HTMLDivElement>(null);

  const fetchRequest = async (offset: number, limit: number) => {
    const response = await fetch(`${backendUrl}/get-slice?offset=${offset}&limit=${limit}`, {
      method: "GET",
      headers: {
        token: getToken() ?? "",
      }
    });

    const data = await response.json() as { hasMore: boolean, data: ImageItem[] };

    return data;
  }

  const { items, renderNext } = useInfiniteLoad(
    fetchRequest,
    (item) => item.id,
    {
      initialItemCount: 10,
      nextItemCount: 2
    }
  );

  useEffect(() => {
    console.log("Items", items);
  }, [items])

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
        <button onClick={renderNext}>Render more</button>
        {/* 
        <div className={`${classes.cards}`}>
          {dummy.map((_, index) => <h1 key={index}>{index}</h1>)}
          </div>
        */}
        <LoadingPage ref={loadingElementRef} fullScreen={false} className={`${classes["loading-images"]} ${classes.visible}`} />
      </div>
    </>
  )
}

export default NewHomePage;