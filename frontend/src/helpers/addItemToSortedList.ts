/**
 * @template T
 * @param {T[]} array The sorted input array
 * @param {T} item The item to add to the sorted array
 * @param {(item: T) => number} selector A callback function to select the property of each item on the array to compare. Note that each item in the array should have this property
 * @returns A new array with the item added to the sorted array
 * 
 * This function iterates over the input sorted array, finds the sorted index, and
 * inserts the item there instead of adding the item and resorting the array. This is more efficient.
 * 
 * The reason for a for loop instead of a forEach callback is to break the loop early to provide further
 * efficiency
 */

export const addItemToSortedList = <T>(array: T[], item: T, selector: (item: T) => number) => {
  // If the array is empty, just return the item
  if (array.length === 0) return [item];

  const arrayCopy = [...array];

  // If the item is greater then the item at the end of the array, put it at the end.
  if (selector(item) >= selector(array[array.length - 1])) {
    arrayCopy.push(item);
    return arrayCopy;
  };

  for (let i = 0; i < array.length; i++) {

    // If the current index is at the correct sorted position, add the item there
    if (selector(item) < selector(array[i])) {
      arrayCopy.splice(i, 0, item);
      return arrayCopy;
    }
  }

  return arrayCopy;
}

/**
 * @template T
 * @param {T[]} array The sorted input array
 * @param {T[]} items The items to add to the sorted array
 * @param {(item: T) => number} selector A callback function to select the property of each item on the array to compare. Note that each item in the array should have this property
 * @returns A new array with the items added to the sorted array
 * 
 * For the singular addItemToSortedList, it's more efficient to find the sorted index in the array and insert
 * it there. However, this is different with the plural version, as finding the sorted index for each item
 * would have a time complexity of O(n^2). Instead, I'm adding all the items to the array, and then sorting
 * it, which creates a time complexity of O(n log n) which is significantly faster.
 */

export const addItemsToSortedList = <T>(array: T[], items: T[], selector: (item: T) => number) => {
  // Create a reusable callback function to sort the array
  const sortCallback = (a: T, b: T) => selector(a) - selector(b);

  // If there are no items in the input array, return the sorted items that should've been added
  if (array.length === 0) return items.sort(sortCallback);

  const arrayCopy = [...array, ...items].sort(sortCallback);
  return arrayCopy;
}