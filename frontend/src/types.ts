export type ActionCreator<T extends Record<string, any>> = {
  [K in keyof T]: {
    type: K;
    payload: T[K];
  }
}[keyof T];