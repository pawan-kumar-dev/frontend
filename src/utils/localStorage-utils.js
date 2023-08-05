export const setDataInLocalStorage = (key, data) => {
  if (key) {
    if (typeof data === "object") {
      const newData = JSON.stringify(data);
      localStorage.setItem(key, newData);
    } else localStorage.setItem(key, data);
  }
};

export const getDataFromLocalStorage = (key) => {
  if (key) {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        return data;
      }
    }
  }
  return null;
};

export const removeDataFromLocalStorage = (key) => {
  if (key) {
    const data = localStorage.getItem(key);
    if (data) {
      localStorage.removeItem(key);
    }
  }
  return null;
};

export const clearDataFromLocalStorage = () => localStorage.clear();
