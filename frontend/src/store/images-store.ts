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
    description: "Veniam aliquip quis nulla amet enim veniam labore quis ea amet ad duis cupidatat. Labore adipisicing occaecat laboris adipisicing aliqua sunt aliqua tempor elit esse nostrud anim excepteur veniam. Do et commodo nisi amet non eiusmod.",
    id: "i1",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 2",
    date: "11/28/2115",
    description: "Cupidatat excepteur laboris laborum dolor ullamco. Cupidatat consectetur nulla elit irure ea amet nisi ut cillum sint eiusmod. Pariatur qui in minim eiusmod deserunt deserunt Lorem incididunt proident esse et. Lorem velit veniam ut occaecat sint dolore veniam dolore commodo enim nostrud eu cillum aute. Dolore ullamco officia do anim commodo dolor quis aliqua nulla nulla. Quis elit aliqua non cillum aliquip ullamco reprehenderit et. Consequat duis exercitation anim officia minim in et sit proident.",
    id: "i2",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 3",
    date: "9/15/2069",
    description: "Velit dolor esse incididunt sit irure ullamco dolor voluptate irure enim quis excepteur. Voluptate sit minim anim nulla voluptate ex commodo magna voluptate cupidatat. Nulla excepteur nostrud id exercitation est cupidatat minim officia enim tempor elit esse. Duis culpa aliquip nostrud aliquip nulla dolore nisi officia elit non. Sint Lorem sunt eu irure mollit officia commodo ad do deserunt culpa fugiat ex. Ex sit ullamco cupidatat magna exercitation qui id non magna irure consectetur nisi.",
    id: "i3",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 4",
    date: "5/19/2078",
    description: "Deserunt duis quis irure non laboris dolore labore nulla velit ex. Fugiat dolore cillum consequat aute proident in pariatur excepteur exercitation do. Veniam in cillum voluptate non ullamco ex aliquip est cillum et excepteur fugiat eiusmod. Excepteur commodo mollit aliquip qui ea nostrud elit. Esse ex nostrud in voluptate aliqua culpa est in officia. Aliqua minim reprehenderit dolore laborum id voluptate tempor ad nostrud in enim quis.",
    id: "i4",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 5",
    date: "10/6/2094",
    description: "Eiusmod officia nisi fugiat cillum officia esse reprehenderit do id qui velit enim duis. Eu nisi magna aute elit nostrud id pariatur amet labore aliqua non occaecat minim consequat. Est aliquip ipsum incididunt Lorem sit. Nostrud laboris incididunt nulla do tempor eiusmod adipisicing incididunt. Ipsum voluptate in reprehenderit est tempor enim mollit. Ex enim mollit culpa occaecat eu qui veniam id duis. Laboris enim pariatur voluptate sint.",
    id: "i5",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 6",
    date: "7/3/2106",
    description: "Esse ea velit dolor ullamco labore Lorem tempor sunt culpa velit eiusmod elit officia. Reprehenderit ullamco ullamco minim enim anim proident ex consequat occaecat cillum. Officia Lorem magna fugiat pariatur. Est excepteur deserunt veniam aliqua exercitation tempor magna anim est occaecat eiusmod. Cupidatat labore sunt mollit excepteur aliquip officia esse. Dolor irure cupidatat pariatur cillum minim aliqua non.",
    id: "i6",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 7",
    date: "5/17/2073",
    description: "Ad reprehenderit magna ex adipisicing velit. Adipisicing elit reprehenderit esse occaecat. Consectetur do magna cillum adipisicing dolor velit ad elit enim. Laboris veniam consectetur minim id amet est occaecat pariatur cupidatat id irure dolore. Quis esse ullamco elit adipisicing exercitation. Sunt fugiat elit consequat est consectetur mollit. Aliqua magna et cillum sunt adipisicing.",
    id: "i7",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 8",
    date: "4/25/2106",
    description: "Veniam non aute adipisicing Lorem sint pariatur proident. Laboris sunt ipsum minim do officia ullamco. Eiusmod do proident ut aliquip qui non ex sit elit. Minim nostrud sint elit ea ut dolor.",
    id: "i8",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 9",
    date: "5/8/2079",
    description: "Mollit cupidatat ullamco commodo deserunt incididunt velit fugiat ipsum anim officia magna ut ullamco in. Consectetur proident culpa voluptate mollit commodo magna esse occaecat commodo enim veniam ullamco nostrud Lorem. Nulla laboris culpa pariatur fugiat laborum ullamco adipisicing officia commodo voluptate in mollit magna.",
    id: "i9",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 10",
    date: "8/15/2051",
    description: "Et tempor pariatur occaecat nulla aliquip et non incididunt quis. Excepteur id eu qui exercitation adipisicing ea consectetur reprehenderit duis eiusmod culpa sint qui nisi. Cillum reprehenderit id duis minim anim mollit nulla quis qui elit occaecat laborum magna. Sunt commodo quis in laborum duis cillum do enim anim irure magna esse deserunt. Voluptate consectetur proident culpa sint non.",
    id: "i10",
    img: "https://placehold.co/1000x1000",
  },
  {
    title: "Image 11",
    date: "9/3/2108",
    description: "Commodo fugiat velit commodo fugiat enim cupidatat dolore anim labore enim officia minim laboris. Cupidatat ad tempor et irure eiusmod Lorem quis in ea est dolore pariatur reprehenderit quis. Minim duis irure incididunt esse anim velit mollit. Est exercitation proident mollit ea ut et mollit voluptate mollit duis pariatur laborum sit et.",
    id: "i11",
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