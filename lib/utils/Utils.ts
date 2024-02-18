export default class Utils {
  static Round = (num: any) => Math.round(num * 100) / 100;
  static getStorage = (key: any) => JSON.parse(localStorage.getItem(key) ?? "");
  static setStorage = (key: any, value: any) => localStorage.setItem(key, JSON.stringify(value));
  static removeAllChildNodes(parent: any) {
    while (parent.firstChild) parent.removeChild(parent.firstChild);
  }
  static uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  // static hasValue = (value) => [undefined, null, -1, "", "-1"].includes(value) === false;
  static hasValue = (value: any) => [undefined, null, ""].includes(value) === false;
  static Formate = (amount: any) => {
    let newVal = `${amount}`?.replace("-", "").split("."),
      beforPoint = newVal[0],
      length = beforPoint?.length,
      owl = newVal[1] && !newVal[1]?.startsWith("00") ? `.${newVal[1].length > 2 ? newVal[1].substring(0, 2) : newVal[1]}` : "";
    for (let o = length; o > 0; o -= 3) o - 3 > 0 ? (owl = `,${beforPoint.substring(o, o - 3)}${owl}`) : (owl = beforPoint.substring(0, o) + owl);
    return amount >= 0 ? owl : `- ${owl}`;
  };

  static FormateWithCurrency = (amount: any, currencyId: any) => {
    let newVal = `${amount}`?.replace("-", "").split("."),
      beforPoint = newVal[0],
      length = beforPoint?.length,
      owl = newVal[1] && !newVal[1]?.startsWith("00") ? `.${newVal[1].length > 2 ? newVal[1].substring(0, 2) : newVal[1]}` : "";
    for (let o = length; o > 0; o -= 3) o - 3 > 0 ? (owl = `,${beforPoint.substring(o, o - 3)}${owl}`) : (owl = beforPoint.substring(0, o) + owl);

    // let formated = `${owl}  ${getShortCurrency(currencyId)}`;
    let formated = `${owl}`;
    return amount >= 0 ? formated : `${formated} -`;
  };
  static generateQuery = (query: any, url: any) => {
    query = Object.entries(query).reduce((acc: any, [id, value]: any) => {
      if (Utils.hasValue(value.value)) acc[id] = value.value;
      return acc;
    }, {});
    return `${url ? `/${url}` : ""}?${new URLSearchParams(query)}`;
  };

  static sleep = (ms = 3000) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  static setupStorage = ({ service, storageKey, storageType = "local" }: any) => {
    const storage = storageType === "local" ? localStorage : sessionStorage;

    const getCleanString = (text = "") => storageKey + text.replace(/[?&=/!]/g, "-");
    service.getStored = (store_key: any) => JSON.parse(storage.getItem(getCleanString(store_key)) ?? "");
    service.setStorage = (store_key: any, data: any) => {
      let _storeKey = getCleanString(store_key);
      if (Object.values(data).length > 0) storage.setItem(_storeKey, JSON.stringify(data));
      else storage.removeItem(_storeKey);
    };
    service.removeStored = () => {
      for (let i = 0; i < storage.length; i++) {
        let key = storage.key(i);
        if (key && key.startsWith(storageKey)) storage.removeItem(key);
      }
    };
  };

  static memoize = (fn: any) => {
    const cache: any = {};
    return (...args: any) => {
      const key = JSON.stringify(args);
      if (cache[key]) return cache[key];
      const result = fn(...args);
      cache[key] = result;
      return result;
    };
  };

  static preformace = (fn: any) => {
    return (...args: any) => {
      console.time("preformace");
      const result = fn(...args);
      console.timeEnd("preformace");
      return result;
    };
  };

  static debounce = (fn: any, delay: any) => {
    let timer: any;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  static throttle = (fn: any, delay: any) => {
    let timer: any;
    return (...args: any) => {
      if (timer) return;
      timer = setTimeout(() => {
        fn(...args);
        timer = null;
      }, delay);
    };
  };

  static groupBy = (array = [], key = "") =>
    array.reduce((group, element) => {
      const value = element[key];
      return {
        ...group,
        [value]: [...(group[value] || []), element],
      };
    }, {});

  static formatedRelativeDate = (toDate: any, fromDate: any = new Date()) => {
    let duration = (toDate - fromDate) / 1000;
    for (const [unit, secondsInUnit] of DIVISIONS) {
      if (Math.abs(duration) < secondsInUnit || unit === "year") {
        const value = Math.round(duration);
        return RELATIVE_DATE_FORMATTER.format(value, unit);
      }
      duration /= secondsInUnit;
    }
  };
}

const RELATIVE_DATE_FORMATTER = new Intl.RelativeTimeFormat("ar", {
  numeric: "auto",
});

const DIVISIONS: any = [
  ["seconds", 60],
  ["minutes", 60],
  ["hours", 24],
  ["days", 7],
  ["weeks", 4.34812],
  ["months", 12],
  ["years", Infinity],
];
