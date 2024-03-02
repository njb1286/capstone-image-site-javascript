export function lowerCase<T extends string, U extends Lowercase<T>>(str: T): U {
  return str.toLowerCase() as U;
}

export function upperCase<T extends string, U extends Uppercase<T>>(str: T): U {
  return str.toUpperCase() as U;
}

export function capitalize<T extends string, U extends Capitalize<T>>(str: T): U {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() as U;
}