export const CreateTag = (tag: string, props: any, children?: any) => {
  const element = document.createElement(tag) as any;
  Object.entries(props).forEach(([key, value]) => (element[key] = value));
  children && element.append(...children);
  return element;
};

export const Div = (props: any, children?: any) => CreateTag("div", props, children);
export const P_Tag = (props: any, children?: any) => CreateTag("p", props, children);
export const Span_Tag = (props: any) => CreateTag("span", props);
export const Input_Tag = (props: any) => CreateTag("input", props);
export const Img_Tag = (props: any) => CreateTag("img", props);
export const Button_Tag = (props: any) => CreateTag("button", props);
export const Fragment_Tag = (children = []) => CreateTag("fragment", {}, children);
export const LinkButton_Tag = (props: any) => CreateTag("a", props);
export const Br_Tag = () => document.createElement("br");

export function Select_Tag({ className, value, options, onChange }: any) {
  const selectNode = document.createElement("select");
  options.forEach((item: any) => {
    const optionNode = document.createElement("option");
    optionNode.value = item.id;
    optionNode.innerText = item.title;
    selectNode.append(optionNode);
  });
  selectNode.className = className;
  selectNode.onchange = onChange;
  selectNode.value = value;
  return selectNode;
}

export function Video_Tag(props: any, children: any) {
  props.id = "video";
  return CreateTag("video", props, children);
}

export const isMobile = navigator.userAgent.toLowerCase().match(/mobile/i) != null;

interface ReactToNodeProps {
  reactComponent?: any;
  props?: any;
}
export const ReactToNode = ({ reactComponent, props = {} }: ReactToNodeProps) => {
  const fn = reactComponent?.type ?? reactComponent;
  if (typeof fn === "function") return create(fn(props));
};

const create = (reactComponent: any) => {
  if (!reactComponent) return document.createTextNode("");
  if (typeof reactComponent === "string") return document.createTextNode(reactComponent);

  let element: any;
  if (reactComponent.type === "svg") return createSvg(reactComponent);
  else if (typeof reactComponent.type === "function") element = create(reactComponent.type(reactComponent.props));
  else element = document.createElement(reactComponent.type);

  Object.entries(reactComponent.props).map(([key, value]: any) => {
    if (key === "children") return;
    else if (key === "style") return Object.entries(value).map(([styleKey, styleValue]) => (element.style[styleKey] = styleValue));
    else if (key !== "className") key = key.toLocaleLowerCase();
    element[key] = value;
  });
  if (typeof reactComponent.props.children === "object") {
    Array.isArray(reactComponent.props.children)
      ? Object.values(reactComponent.props.children).forEach((nestedChild) => element.append(create(nestedChild)))
      : element.append(create(reactComponent.props.children));
  } else element.append(reactComponent.props.children ?? "");
  return element;
};

const createSvg = (svg: any) => {
  let element = document.createElementNS("http://www.w3.org/2000/svg", svg.type);
  const children = svg.props.children;
  Object.entries(svg.props).map(([key, value]: any) => {
    if (key === "children") return;
    else if (key === "style") return Object.entries(value).map(([styleKey, styleValue]) => (element.style[styleKey] = styleValue));
    else if (NS_KEYS[key]) {
      element.setAttribute(NS_KEYS[key], value);
    } else element.setAttribute(camelToDashCase(key).toLowerCase(), value);
  });
  if (typeof children === "object") {
    Array.isArray(children) ? Object.values(children).forEach((nestedChild) => element.append(createSvg(nestedChild))) : element.append(createSvg(children));
  } else element.append(children ?? "");
  return element;
};

const NS_KEYS: any = {
  className: "class",
  viewBox: "viewBox",
};
const camelToDashCase = (str: any) => str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

// const dashToCamelCase = (str) =>
//   str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())

// const preformance = (fn, ...args) => {
//   const start = performance.now()
//   const result = fn(...args)
//   const end = performance.now()
//   console.log(`Time: ${end - start}ms`)
//   Logger.info(result)
//   return result
// }
