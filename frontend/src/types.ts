import { ImageItem, categories } from "./store/images-store";

export type Category = typeof categories[number];

export type ActionCreator<T extends Record<string, any>> = {
  [K in keyof T]: {
    type: K;
    payload: T[K];
  }
}[keyof T];

export type ActionCreatorNoPayload<T extends string[]> = {
  type: T[number];
};

export type ImageActions = ActionCreator<{
  SET_IMAGE_ITEMS: ImageItem[];
  ADD_IMAGE_ITEM: ImageItem;
  ADD_IMAGE_ITEMS: ImageItem[];
  UPDATE_IMAGE_ITEM: Optional<Omit<ImageItem, "date">> & { id: number };
  DELETE_IMAGE_ITEM: number;

  SET_MODAL_VISIBLE: boolean;
  ADD_LOADED_CATEGORY: Category;
  SET_TOKEN: string | null,

  SET_TEMP_PASSWORD: string;

}> | ActionCreatorNoPayload<[
  "HAS_NO_MORE_ITEMS",
  "INITIAL_RENDER"
]>;

