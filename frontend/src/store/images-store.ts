import { Reducer, configureStore } from "@reduxjs/toolkit";

export type ImageItem = Readonly<{
  title: string;
  description: string;
  img: string;
  id: string;
  date: string;
}>;

const images: ImageItem[] = [
  {
    title: "Image 1",
    date: "7/31/2037",
    description: "Description for Image 1",
    id: "i1",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 2",
    date: "11/28/2115",
    description: "Description for Image 2",
    id: "i2",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 3",
    date: "9/15/2069",
    description: "Description for Image 3",
    id: "i3",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 4",
    date: "5/19/2078",
    description: "Description for Image 4",
    id: "i4",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 5",
    date: "10/6/2094",
    description: "Description for Image 5",
    id: "i5",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 6",
    date: "7/3/2106",
    description: "Description for Image 5",
    id: "i5",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 7",
    date: "5/17/2073",
    description: "Description for Image 5",
    id: "i5",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 8",
    date: "4/25/2106",
    description: "Description for Image 5",
    id: "i5",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 9",
    date: "5/8/2079",
    description: "Description for Image 5",
    id: "i5",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 10",
    date: "8/15/2051",
    description: "Description for Image 5",
    id: "i5",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 11",
    date: "9/3/2108",
    description: "Description for Image 5",
    id: "i5",
    img: "https://placehold.co/1000x1000",
  }
]

const initialState = {
  datapacks: images,
}


export type ImageState = typeof initialState;

export type ImageActions = {

}

type Actions = {
  [K in keyof ImageActions]: {
    type: K;
    payload: ImageActions[K];
  }
}[keyof ImageActions];

const datapacksReducer: Reducer<ImageState, Actions> = (state = initialState, action) => {
  if (!state) {
    return initialState;
  }

  return state;
}

export const imageStore = configureStore({
  reducer: datapacksReducer,
});