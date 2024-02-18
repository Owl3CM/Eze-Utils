import { TimedCallback } from "../../utils";
import { Div, P_Tag, ReactToNode, Span_Tag } from "../Tools";

const colorByType: any = {
  default: { bg: "#d5d8db", text: "#2f3b4b", border: "#2f3b4b" },
  info: { bg: "#d5eaf0", text: "#216b81", border: "#2f96b4" },
  success: { bg: "#edf5d2", text: "#4c5923", border: "#8ea641" },
  warn: { bg: "#feeacd", text: "#c47504", border: "#f89406" },
  // error: { bg: "#dd3643", text: "#dd3643", border: "#dd3643" },
  error: { bg: "#fce0e0", text: "#bb4d4d", border: "#ee6363" },
  primary: { bg: "#ffffff", text: "#2f3b4b", border: "#dddddd" },
  secondary: { bg: "#999999", text: "#2f3b4b", border: "#999999" },
};

const init = () => {
  if (document.getElementById("toast-holder")) return;
  const toastHolder = Div({ id: "toast-holder", className: "toast-holder" });
  document.body.append(toastHolder);
};
init();

interface FuncProps {
  title?: string;
  content?: string;
  timeout?: number;
  Component?: any;
  componentProps?: any;
  haveBorder?: any;
}

interface ToastProps {
  type: "default" | "info" | "success" | "warn" | "error" | "primary" | "secondary";
}

const Toast = ({
  title = "",
  content = "",
  timeout = 4000,
  type = "default",
  haveBorder = true,
  Component = null,
  componentProps = {},
}: ToastProps & FuncProps) => {
  let id = title + content;
  const { bg, text, border } = colorByType[type];
  let style = (haveBorder ? `background-color:#fff; border-left: solid 8px ${border};` : `background-color:${bg};`) + `color:${text};`;

  if (timeout < 1 || TimedCallback.alreadyPending(id) === false) createNewToast();
  else TimedCallback.restart({ id, timeout });

  function createNewToast() {
    const infoContainer = Div({ style, className: "toast-container info-fade-in" }, [
      P_Tag({ className: "row-center" }, [
        Span_Tag({
          className: "x",
          style: `background-color:${text}aa;`,
          onclick: removeMessage,
        }),
        Span_Tag({ innerText: title }),
      ]),
      content
        ? Span_Tag({
            className: "toast-content",
            innerText: content,
          })
        : "",
      Component
        ? ReactToNode({
            reactComponent: Component,
            props: componentProps,
          })
        : "",
    ]);

    function onRepated() {
      infoContainer.classList.remove("info-fade-in");
      infoContainer.classList.add("shake");
      setTimeout(() => {
        infoContainer.classList.remove("shake");
      }, 300);
    }

    function removeMessage() {
      infoContainer.classList.add("info-fade-out");
      infoContainer.style.maxHeight = infoContainer.offsetHeight + "px";
      setTimeout(() => {
        infoContainer.style.padding = "0px";
        infoContainer.style.marginBottom = "0px";
        infoContainer.style.maxHeight = "0px";
      }, 50);

      setTimeout(() => infoContainer.remove(), 500);
      TimedCallback.remove(id);
    }

    document.getElementById("toast-holder")!.append(infoContainer);
    TimedCallback.create({ id, timeout, callback: removeMessage, onRepated });
  }
};

Toast.default = (args: FuncProps) => Toast({ ...args, type: "default" });
Toast.info = (args: FuncProps) => Toast({ ...args, type: "info" });
Toast.success = (args: FuncProps) => Toast({ ...args, type: "success" });
Toast.warn = (args: FuncProps) => Toast({ ...args, type: "warn" });
Toast.error = (args: FuncProps) => Toast({ ...args, type: "error" });
Toast.primary = (args: FuncProps) => Toast({ ...args, type: "primary" });
Toast.secondary = (args: FuncProps) => Toast({ ...args, type: "secondary" });

export default Toast;
