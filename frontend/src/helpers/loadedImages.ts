// This keeps the images loaded in memory so they don't have to be re-fetched when this component un-renders

export const loadedImages = new Set<HTMLImageElement>();