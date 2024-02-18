import "./json.css";
export { default as JsonBuilder } from "./JsonBuilder";
export { default as JsonParser } from "./JsonParser";
export const MockJsonSample = {
  name: "John",
  age: 30,
  ownCars: true,
  obj: {
    car1: "Ford",
    car2: "BMW",
    car3: "Fiat",
  },
  arr: ["Ford", "BMW", "Fiat"],
  arrObj: [
    {
      name: "Ford",
      models: ["Fiesta", "Focus", "Mustang"],
    },
    {
      name: "BMW",
      models: ["320", "X3", "X5"],
    },
  ],
  fun: () => {
    return "test";
  },
  fun2: (teset: any) => teset,
  fun3: (teset: any) => {
    return teset;
  },
  fun4: ({ teset }: any) => {
    return teset;
  },
  fun5: ({ teset }: any) => teset,
  fun6: ({ teset }: any) => {
    let test = teset + 1;
    console.log(teset);
  },
};
