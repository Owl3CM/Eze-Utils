import { Utils } from "../../utils";
import React from "react";

interface Props {
  vertical?: boolean;
  minBefor?: number;
  minAfter?: number;
  initialRatios?: number[];
  className?: string;
  storageKey?: string;
  style?: React.CSSProperties;
}

const Round = (num: number) => Math.round(num * 100) / 100;

const Spliter = ({ vertical, minBefor, minAfter, initialRatios, className = "", storageKey, style }: Props) => (
  <SpliterClass
    {...{
      vertical,
      minBefor,
      minAfter,
      initialRatios,
      storageKey,
      className,
      style,
    }}
  />
);
export default Spliter;

class SpliterClass extends React.Component {
  id: string;
  setReslt: any;
  result = 0;
  startPostino = 0;
  parentDim = 0;
  targetChild: any;
  relatedChild: any;
  cols: any;
  startDim: any;
  relatedStartedDim: any;
  newDim: any;
  newRelatedDim = 0;
  vertical: any;
  className: any;
  style: any;

  constructor(props: Props) {
    let { vertical, minBefor = 0.1, minAfter = 0.1, initialRatios = [0.5, 0.5], storageKey = "", className = "" } = props;
    super(props);
    this.vertical = vertical;
    this.className = className;
    this.style = props.style;

    this.id = Utils.uuid();
    this.setReslt = vertical
      ? (nowPostion: any) => (this.result = Round((nowPostion - this.startPostino) / this.parentDim))
      : (nowPostion: any) => (this.result = Round((this.startPostino - nowPostion) / this.parentDim));

    this.componentDidMount = () => {
      const spliter = document.getElementById(this.id)!;
      const spliterParent = spliter.parentElement!;
      let children = Object.values(spliterParent.children);
      let childCount = children.filter((child) => child.ariaLabel !== "sapreator").length;

      let _initialRatios: any = [];
      if (initialRatios) {
        children.forEach((child) => {
          if (child.ariaLabel !== "sapreator") {
            _initialRatios.push(initialRatios[0]);
            initialRatios = initialRatios.splice(1);
          } else if (child.id === spliter.id) {
            _initialRatios.push(0);
          }
        });
      }

      let stored = storageKey ? JSON.parse(localStorage.getItem(storageKey) ?? "") : null;
      if (stored && stored.length === spliterParent.childElementCount) _initialRatios = stored;
      else if (!_initialRatios || _initialRatios.length !== spliterParent.childElementCount) {
        _initialRatios = [];
        for (let i = 0; i < spliterParent.childElementCount; i++) _initialRatios.push(Round(1 / childCount));
      }

      this.cols = _initialRatios;

      let dim = "flexGrow";

      const AddSeparativespliter = () => {
        let client = "client" + (vertical ? "Y" : "X");

        spliter.addEventListener("mousedown", (e) => {
          // remove transition to avoid flickering
          this.targetChild.style.transition = "none";
          this.relatedChild.style.transition = "none";

          this.startPostino = vertical ? e.clientY : e.clientX;
          this.startDim = Round(this.targetChild.style[dim]);
          this.relatedStartedDim = Round(this.relatedChild.style[dim]);
          this.parentDim = vertical ? spliterParent.clientHeight : spliterParent.clientWidth;

          let onMove = (nowPostion: number) => {
            this.setReslt(nowPostion);
            this.newDim = Round(this.startDim + this.result);
            if (this.newDim < minBefor) return;

            this.newRelatedDim = Round(this.relatedStartedDim - this.result);
            if (this.newRelatedDim < minAfter) return;

            this.targetChild.style[dim] = `${this.newDim}`;
            this.relatedChild.style[dim] = `${this.newRelatedDim}`;
          };

          const mouseMove = (e: any) => onMove(e[client]);

          let mouseUp = () => {
            SaveCols();
            // add transition back
            this.targetChild.style.transition = "";
            this.relatedChild.style.transition = "";
            document.removeEventListener("mousemove", mouseMove);
            document.removeEventListener("mouseup", mouseUp);
          };
          document.addEventListener("mousemove", mouseMove);
          document.addEventListener("mouseup", mouseUp);
        });

        // spliter.addEventListener("touchstart", (e) => {
        //     this.startPostino = e.touches[0][client];
        //     spliter.style.backgroundColor = sapreatorColors[1];
        //     this.startDim = Round(this.cols[i]);
        //     this.relatedStartedDim = Round(this.cols[i + 1]);
        //     this.parentDim = vertical ? ref.clientHeight : ref.clientWidth;

        //     minBefor = targetChild.getAttribute("min") || min;
        //     minAfter = relatedChild.getAttribute("min") || min;

        //     const touchMove = ({ touches }) => onMove(touches[0][client], i);
        //     let tochEnd = (e) => {
        //         SaveCols();
        //         spliter.style.backgroundColor = sapreatorColors[0];
        //         document.removeEventListener("touchmove", touchMove);
        //         document.removeEventListener("touchend", tochEnd);
        //     };
        //     document.addEventListener("touchmove", touchMove);
        //     document.addEventListener("touchend", tochEnd);
        // });
      };

      const SaveCols = () => {
        this.cols = children.map((child: any) => Round(child.style[dim]));
        storageKey && localStorage.setItem(storageKey, JSON.stringify(this.cols));
      };

      children.forEach((child: any, i) => {
        if (child.ariaLabel !== "sapreator") {
          child.style[dim] = _initialRatios[i];
          child.style.flexBasis = "0";
          // child.style.overflow = "auto";
          child.classList.add("scroller");
        } else if (child.id === spliter.id) {
          this.targetChild = children[i - 1];
          this.relatedChild = children[i + 1];
          if (!this.relatedChild) return;
          // this.targetChild.style.transition = "all  5ms ease-out";
          // this.relatedChild.style.transition = "all 5ms ease-out";
          AddSeparativespliter();
          spliterParent.style.display = "flex";
          spliterParent.style.flexDirection = vertical ? "column" : "row";
          spliterParent.style.flexWrap = "nowrap";
        }
      });
    };
  }

  render = () => {
    return (
      <span
        aria-label="sapreator"
        id={this.id}
        style={this.style}
        className={`${this.className} spliter spliter-${this.vertical ? "vertical" : "horizontal"}`}
      />
    );
  };
}
