import React from "react";

const Boolean = ({ json, key }: any) => <span key={key} className="obj-text-1">{`${json}`}</span>;
const StringArray = ({ json }: any) => <span className="obj-text-2 px-s">" {json} " , </span>;
const Image = ({ json }: any) => <img src={json} style={{ maxWidth: 100, objectFit: "contain" }} />;
const ArrayImages = ({ json }: any) => json.map((_i: string) => <img key={_i} src={_i} style={{ width: 150 }} />);
const Function = ({ json, key }: any) => {
  return (
    <span onClick={json} key={key} className="obj-text-1">
      {JSON.stringify(json.toString().split("{")[0]?.split("=>")[0] || "undefined function")}
    </span>
  );
};
const String = ({ json, key }: any) => (
  <span key={key} className="obj-text-1">
    " {json} "
  </span>
);
const Number = ({ json, key }: any) => (
  <span key={key} className="obj-text-1">
    {json}
  </span>
);
const Array = ({ json }: any) => {
  json = Object.values(json)
    .filter((value) => nullables.includes(value) === false)
    .sort((o: any) => (sortByType(o[1]) ? -1 : 1));
  return (
    <div className="obj">
      <span className="obj-text-3 px-s">{"["}</span>
      {json.map((_i: any, i: number) => {
        let _type = getType(_i);
        return _type === "Object" || _type === "Array" ? <_Object key={i} json={_i} /> : <StringArray key={i} json={_i} />;
      })}
      <span className="obj-text-3 px-s" style={{ alignSelf: "end" }}>
        {"]"}
      </span>
    </div>
  );
};
const _Object = ({ json }: any) => {
  const _json = Object.entries(json)
    .filter(([_, value]: any) => nullables.includes(value) === false)
    .sort((o: any) => (sortByType(o[1]) ? -1 : 1));
  return (
    <div className="json-bg-prim round-sm p-lg row-center wrap gap-md">
      <span>{"{"}</span>
      {_json.map(([key, value]: any, _i) => {
        let type = getType(value);
        if (!type) return;
        if (type === "Array") {
          if (key === "images") {
            type += "Images";
            // value = Object.values(Object.values(value)[0]);
            value = Object.values(value);
          }
        } else if (type === "String" && value.startsWith("http") && (key === "image" || checkIsImageURL(value))) type = "Image";

        return (
          <div key={_i} className={`obj ${type}`}>
            <span className={`obj-key`}>{key}</span>
            {UiKit[type]({ key: _i, json: value })}
          </div>
        );
      })}
      <span>{"},"}</span>
    </div>
  );
};
const JsonBuilder = ({ json, className = "json-builder" }: any) => {
  const _json = Object.entries(json)
    .filter(([_, value]: any) => nullables.includes(value) === false)
    .sort((o) => (sortByType(o[1]) ? -1 : 1));
  return (
    <div className={className}>
      {_json.map(([key, value]: any, _i) => {
        let type = getType(value);
        if (!type) return;
        if (type === "Array") {
          if (key === "images") {
            type += "Images";
            // value = Object.values(Object.values(value)[0]);
            value = Object.values(value);
          }
        } else if (type === "String" && value.startsWith("http") && (key === "image" || checkIsImageURL(value))) type = "Image";

        return (
          <div key={key} className={`obj ${type}`}>
            <span className={`obj-key`}>{key}</span>
            {UiKit[type]({ key: _i, json: value })}
          </div>
        );
      })}
    </div>
  );
};

export default JsonBuilder;
const valdTyps = ["String", "Number", "Boolean", "Object", "Array", "ArrayImages", "Undefined", "Null", "Image", "Function"];
const UiKit: any = {
  String,
  Number,
  Boolean,
  Image,
  Function,
  Object: _Object,
  Array,
  ArrayImages,
  Null: () => <span />,
  Undefined: () => <span />,
};
const nullables: any = [undefined, null, ""];

const getType = (obj: any) => {
  let type = Object.prototype.toString.call(obj).slice(8, -1);
  if (valdTyps.includes(type)) return type;
};
const sortByType = (obj: any) => {
  const type = getType(obj);
  return type
    ? {
        String: 1,
        Number: 2,
        Boolean: 3,
        ArrayImages: 4,
        Image: -1,
        Object: -1,
        Array: false,
        Undefined: false,
        Null: false,
      }[type]
    : -1;
};
const checkIsImageURL = (url: any) => /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);

let json = {
  id: "943-34234kf-f32f-23f32f-c8",
  name: "Jhon Doe",
  descriptionT: "somthing going on here ok then this is a description so that is not a good idea",
  amBoolean: true,
  colction: ["one ", "test", "four", "four", "four", "owls"],
  objectColctionT: [
    {
      id: "943-34234kf-f32f-23f32f-c8",
      name: "Jhon Doe",
      descriptionT: "somthing going on here ok then this is a description so that is not a good idea",
    },
    {
      id: "943-34234kf-f32f-23f32f-c8",
      name: "Jhon Doe",
      descriptionT: "somthing going on here ok then this is a description so that is not a good idea",
      amBoolean: true,
    },
  ],
  object: {
    id: "K-sdf-KK-sdfK",
    name: "Jhon Doe",
    description: "this is a description",
    idK: "K-sdf-KK-sdfK",
    nameK: "Obdes test by Jhon Doe",
  },
};
