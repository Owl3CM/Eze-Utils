import { Div, Fragment_Tag, Img_Tag, Span_Tag } from "../Tools";

const Function = ({ item }: any) => {
  return Span_Tag({
    className: "obj-text-1",
    onclick: item,
    innerText: JSON.stringify(item.toString().split("{")[0]?.split("=>")[0] || "undefined function"),
  });
};
const String = ({ item }: any) => Span_Tag({ className: "obj-text-1", innerText: `" ${item} "` });
const Number = ({ item }: any) => Span_Tag({ className: "obj-text-1", innerText: `${item}` });
const Boolean = ({ item }: any) => Span_Tag({ className: "obj-text-1", innerText: item });
const StringArray = (item: any) => Span_Tag({ className: "obj-text-2 px-s", innerText: `"${item}" , ` });
const Image = ({ item }: any) => Img_Tag({ style: "max-height: 100px;object-fit: cover;", src: item });
const ArrayImages = ({ item }: any) => item.map((_i: any) => Img_Tag({ height: 250, src: _i }));

const Array = ({ item }: any) => {
  item = Object.values(item)
    .filter((value: any) => nullables.includes(value) === false)
    .sort((o: any) => (sortByType(o[1]) ? -1 : 1));
  return Div({ className: "obj" }, [
    Span_Tag({ className: "objtext-3 px-s", innerText: "[" }),
    Fragment_Tag(
      item.map((_i: any) => {
        let _type = getType(_i);
        return _type === "Object" || _type === "Array"
          ? Div(
              {
                className: "obj",
              },
              [_Object({ key: "", item: _i })]
            )
          : StringArray(_i);
      })
    ),
    Span_Tag({ className: "obj-text-3 px-s", innerText: "]" }),
  ]);
};

const _Object = ({ key, item }: any) => {
  const _item = Object.entries(item)
    .filter(([_, value]: any) => nullables.includes(value) === false)
    .sort((o: any) => (sortByType(o[1]) ? -1 : 1));
  let nodes = document.createElement("div");
  nodes.className = "json-bg-prim round-lg p-s row-center wrap gap-s";
  nodes.id = item.id;

  nodes.append(Span_Tag({ innerText: "{" }));

  _item.forEach(([key, value]: any, _i) => {
    let type = getType(value);
    if (!type) return;
    if (type === "Array") {
      if (key === "images") {
        type += "Images";
        // value = Object.values(Object.values(value)[0]);
        value = Object.values(value);
      }
    } else if (type === "String" && value.startsWith("http") && (key === "image" || checkIsImageURL(value))) type = "Image";

    nodes.append(Div({ className: `obj ${type}` }, [Span_Tag({ className: `obj-key`, innerText: key }), UiKit[type]({ key: _i, item: value })]));
  });
  nodes.append(Span_Tag({ innerText: "}," }));
  return nodes;
};
const JsonParser = ({ json, setItem, containerClass, onClick }: any) => {
  if (typeof json !== "object") return Span_Tag({ className: "json-builder", innerText: json });

  const _item = Object.entries(json)
    .filter(([_, value]: any) => nullables.includes(value) === false)
    .sort((o) => (sortByType(o[1]) ? -1 : 1));
  function onclick() {
    setItem && setItem(json);
  }

  let nodes = document.createElement("div");
  nodes.className = "json-builder";
  if (onClick)
    nodes.onclick = () => {
      onClick(json);
      setItem && setItem(json);
    };
  else nodes.onclick = onclick;
  nodes.id = json.id;
  _item.forEach(([key, value]: any, _i) => {
    let type = getType(value);
    if (!type) return;

    if (type === "Array") {
      if (key === "images") {
        type += "Images";
        // value = Object.values(Object.values(value)[0]);
        value = Object.values(value);
      }
    } else if (type === "String" && value.startsWith("http") && (key === "image" || checkIsImageURL(value))) type = "Image";
    nodes.append(Div({ className: `obj ${type}` }, [Span_Tag({ className: `obj-key`, innerText: key }), UiKit[type]({ key: _i, item: value })]));
  });
  if (containerClass) {
    if (typeof containerClass === "string") nodes = Div({ className: containerClass }, [nodes]);
    else {
      nodes = Div({ style: containerClass }, [nodes]);
      Object.entries(containerClass).forEach(([key, value]: any) => {
        nodes.style[key] = value;
      });
    }
  }
  return nodes;
};
export default JsonParser;

const nullables = [undefined, null, ""];
const UiKit: any = {
  String,
  Number,
  Boolean,
  Object: _Object,
  Array,
  ArrayImages,
  Undefined: Fragment_Tag(),
  Null: Fragment_Tag(),
  Image,
  Function,
};
const valdTyps = ["String", "Number", "Boolean", "Object", "Array", "ArrayImages", "Undefined", "Null", "Image", "Function"];

const checkIsImageURL = (url: any) => /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
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
const getType = (obj: any) => {
  let type = Object.prototype.toString.call(obj).slice(8, -1);
  if (valdTyps.includes(type)) return type;
};
const sample = {
  id: "943-34234kf-f32f-23f32f-c8",
  name: "Jhon Doe",
  descriptionT: "somthing going on here ok then this is a description so that is not a good idea",
  amBoolean: true,
  objectColction: [{ id: "KKKK" }, { name: "Obdestest" }, { description: "obdes" }],
  colction: ["one ", "test", "four", "four", "four", "owls"],
  object: {
    id: "K-sdf-KK-sdfK",
    name: "Jhon Doe",
    description: "this is a description",
    idK: "K-sdf-KK-sdfK",
    nameK: "Obdes test by Jhon Doe",
  },
};
