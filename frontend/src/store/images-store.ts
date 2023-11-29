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
    date: "11/3/2087",
    description: "Description for Image 1",
    id: "i1",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 2",
    date: "8/17/2102",
    description: "Description for Image 2",
    id: "i2",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 3",
    date: "1/13/2091",
    description: "Description for Image 3",
    id: "i3",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 4",
    date: "3/1/2099",
    description: "Description for Image 4",
    id: "i4",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 5",
    date: "9/8/2026",
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