/* eslint-disable no-prototype-builtins */
const get = (obj, path = "", defaultValue) => {
  const keys = path.split(".");
  let value = obj;

  for (const key of keys) {
    if (value == null) {
      // Property does not exist in the object or is null/undefined
      return defaultValue;
    }
    value = value[key];
  }
  return value !== undefined ? value : defaultValue;
};

export { get };
