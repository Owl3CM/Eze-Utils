import React from "react";
import JsonParser from "./JsonParser";
const JsonBuilder = ({ json, containerClass, onClick, setItem }: any) => (
  <div
    id={json.id}
    ref={(ref) => {
      if (!ref || ref.innerHTML) return;
      const _setItem = (item: any) => {
        ref.innerHTML = "";
        ref.append(JsonParser({ json: item, setItem: _setItem, containerClass, onClick }));
      };
      _setItem(json);
    }}
  />
);

export default JsonBuilder;
