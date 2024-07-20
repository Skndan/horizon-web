// Utility type to check if a type is an empty object
type IsEmptyObject<T> = T extends Record<string, never> ? true : false;

// Utility type to remove properties with empty object values
type RemoveEmptyObjects<T> = {
  [K in keyof T]: IsEmptyObject<T[K]> extends true ? never : T[K];
};


// You can also use it in functions
export function cleanInterface(user: any): RemoveEmptyObjects<any> {
  const cleanedUser: Partial<any> = { ...user };

  // Check and remove properties if they are empty objects
  for (const key in cleanedUser) {
    if (cleanedUser[key] && Object.keys(cleanedUser[key] as object).length === 0) {
      delete cleanedUser[key];
    }
  }

  return cleanedUser as RemoveEmptyObjects<any>;
}

type KeyOf<T> = keyof T;

export function filterDuplicates<T>(array: T[], key: KeyOf<T>): T[] {
  const seen = new Set();
  return array.filter(item => {
    const keyValue = item[key];
    if (seen.has(keyValue)) {
      return false;
    } else {
      seen.add(keyValue);
      return true;
    }
  });
}