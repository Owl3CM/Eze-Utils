import { Utils } from "../../utils";
import { JsonParser } from "../Json";
import { Div, isMobile, Span_Tag } from "../Tools";

let container: any = null;
let _logger: any = {
  toggleIcon: () => {},
  addLog: () => {},
  clear: () => {},
  expand: () => {},
  collapse: () => {},
  scrollTo: () => {},
  remove: () => {},
  count: 0,
  style: {},
  firstChild: null,
  setAttribute: () => {},
  getAttribute: () => {},
  removeAttribute: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  classList: {},
  append: () => {},
  insertBefore: () => {},
  parentId: "root",
  silent: false,
  popup: true,
  withoutAnimation: false,
  containerClassName: "logger-container hide-child",
  className: "",
};

const animationDuration = 250;
let observer: any = {
  observe: () => {},
};

const Logger = async ({
  log = "",
  type = "default",
  clear = false,
  parentId = _logger.parentId,
  silent = _logger.silent,
  withoutAnimation = _logger.withoutAnimation,
  className = _logger.className,
}) => {
  if (!container) {
    await Utils.sleep(100);
    createLogger(parentId);
  }

  if (clear) _logger.clear();
  console.log(log);

  let jsonEl = Div(
    {
      className: `log-container ${className} ${withoutAnimation ? "" : "fade-in-log"}`,
    },
    [JsonParser({ json: log })]
  );
  jsonEl.firstChild.setAttribute("type", type);

  _logger.addLog({ jsonEl, silent });
  // if (timer) setTimeout(() => _logger?.remove(), timer);
};

export default Logger;

Logger.log = (...log: any) => Logger({ log: log.length > 1 ? log : log[0], type: "default" });
Logger.info = (...log: any) => Logger({ log: log.length > 1 ? log : log[0], type: "info" });
Logger.warn = (...log: any) => Logger({ log: log.length > 1 ? log : log[0], type: "warn" });
Logger.error = (...log: any) => Logger({ log: log.length > 1 ? log : log[0], type: "error" });
Logger.debug = (...log: any) => Logger({ log: log.length > 1 ? log : log[0], type: "debug" });
Logger.success = (...log: any) => Logger({ log: log.length > 1 ? log : log[0], type: "success" });

Logger.clear = () => Logger({ clear: true });

Logger.collapse = () => _logger.collapse();
Logger.expand = () => _logger.expand();
Logger.toggle = () => _logger.toggle();
Logger.isCollapsed = () => _logger.getAttribute("is") === "collapsed";
Logger.isExpanded = () => _logger.getAttribute("is") === "expanded";
Logger.is = ({ state }: any) => _logger.getAttribute("is") === state;
Logger.addLog = ({ log, silent = false }: any) => _logger.addLog(log, silent);

Logger.setProps = ({ silent, popup = true, parentId = "root", withoutAnimation, containerClassName, className = "" }: any) => {
  _logger.silent = silent;
  _logger.popup = popup;
  _logger.parentId = parentId;
  _logger.withoutAnimation = withoutAnimation;
  _logger.containerClassName = containerClassName;
  _logger.className = className;
  if (container) {
    container.style.position = popup ? "fixed" : "absolute";
    containerClassName && (container.className = `logger-container hide-child ${containerClassName}`);
  }
};

const createLogger = (parentId: string) => {
  if (container) return;
  const logConainer = Div({ className: "logger-child scroller" });
  container = Div({ id: "logger-container", className: _logger.containerClassName }, [
    Span_Tag({
      className: "logger-clear-btn",
      innerText: "clear",
      id: "logger-clear-btn",
      onclick: (e: any) => {
        e.stopPropagation();
        _logger.clear();
      },
    }),
    logConainer,
  ]);
  container.style.position = _logger.popup ? "fixed" : "static";
  // checkImage()

  _logger.addLog = ({ jsonEl, silent }: any) => {
    if (container.getAttribute("is") === "collapsed") {
      _logger.setIndecator(_logger.count + 1);
      if (!silent) _logger.expand();
    }

    observer.observe(jsonEl, { childList: true, subtree: true });
    jsonEl.setAttribute("log-number", `${logConainer.childElementCount}`);

    logConainer.prepend(jsonEl);
    container.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };
  container.setAttribute("is", "collapsed");

  _logger.setIndecator = (count: number) => {
    _logger.count = count;
    container.setAttribute("log-count", count > 0 ? count : "hide");
  };

  _logger.clear = () => {
    if (!container) return;
    _logger.collapse();
    setTimeout(() => {
      console.clear();
      logConainer.innerHTML = "";
      _logger.setIndecator(0);
    }, animationDuration);
  };

  let moved = [container.offsetLeft, container.offsetTop];
  let startX = 0,
    startY = 0;
  const onMove = (x: any, y: any) => {
    x -= startX;
    y -= startY;
    container.style.left = `${moved[0] + x}px`;
    container.style.top = `${moved[1] + y}px`;
  };

  if (isMobile)
    container.ontouchstart = ({ target, touches }: any) => {
      container.style.transitionDuration = "0s";
      startX = touches[0].clientX;
      startY = touches[0].clientY;

      const checkOffset = 20;
      const isRight = container.offsetLeft + container.offsetWidth - checkOffset < startX;
      const isBottom = container.offsetTop + container.offsetHeight - checkOffset < startY;
      if (isRight && isBottom) return;

      moved = [container.offsetLeft, container.offsetTop];
      const onMoveHandler = ({ touches }: any) => {
        onMove(touches[0].clientX, touches[0].clientY);
      };
      const onUpHandler = () => {
        container.style.transitionDuration = animationDuration + "ms";
        window.removeEventListener("touchmove", onMoveHandler);
        window.removeEventListener("touchend", onUpHandler);
        if (logConainer.childElementCount === 0) return;
        if (Math.abs(moved[0] - container.offsetLeft) > 10 || Math.abs(moved[1] - container.offsetTop) > 10) {
          moved = [container.offsetLeft, container.offsetTop];
          _logger.corectPosition();
          return;
        }
        _logger.toggle();
      };
      window.addEventListener("touchmove", onMoveHandler);
      window.addEventListener("touchend", onUpHandler);
    };
  else
    container.onmousedown = ({ which, clientX, clientY, id }: any) => {
      if (which !== 1) return;
      container.style.transitionDuration = "0s";
      startX = clientX;
      startY = clientY;
      const checkOffset = 20;
      const isRight = container.offsetLeft + container.offsetWidth - checkOffset < startX;
      const isBottom = container.offsetTop + container.offsetHeight - checkOffset < startY;
      if (isRight && isBottom) return;
      moved = [container.offsetLeft, container.offsetTop];
      const onMoveHandler = ({ clientX: x, clientY: y }: any) => {
        onMove(x, y);
      };
      const onUpHandler = () => {
        container.style.transitionDuration = animationDuration + "ms";
        window.removeEventListener("mousemove", onMoveHandler);
        window.removeEventListener("mouseup", onUpHandler);
        if (logConainer.childElementCount === 0) return;
        if (Math.abs(moved[0] - container.offsetLeft) > 10 || Math.abs(moved[1] - container.offsetTop) > 10) {
          moved = [container.offsetLeft, container.offsetTop];
          _logger.corectPosition();
          return;
        }
        _logger.toggle();
      };
      window.addEventListener("mousemove", onMoveHandler);
      window.addEventListener("mouseup", onUpHandler);
    };

  _logger.toggle = () => {
    const isColabsed = container.getAttribute("is") === "collapsed";
    if (isColabsed) {
      _logger.expand();
    } else {
      _logger.collapse();
    }
  };
  _logger.collapse = () => {
    container.setAttribute("is", "collapsed");
    setTimeout(() => {
      _logger.corectPosition();
      _logger.toggleIcon(true);
      container.classList.add("hide-child");
    }, animationDuration);
  };
  _logger.expand = () => {
    _logger.toggleIcon(false);
    const isColabsed = container.getAttribute("is") === "collapsed";
    if (!isColabsed) return;
    _logger.setIndecator(0);
    container.setAttribute("is", "expanded");
    container.classList.remove("hide-child");

    setTimeout(() => {
      _logger.corectPosition();
    }, animationDuration);
  };
  _logger.corectPosition = () => {
    const margin = 20;
    if (container.offsetLeft < 0) container.style.left = "10px";
    else if (container.offsetLeft > window.innerWidth - container.offsetWidth) container.style.left = window.innerWidth - container.offsetWidth - margin + "px";

    if (container.offsetTop < 0) container.style.top = "3%";
    else if (container.offsetTop > window.innerHeight - container.offsetHeight)
      container.style.top = window.innerHeight - container.offsetHeight - margin + "px";
  };

  document.getElementById(parentId)!.append(container);
  setTimeout(() => (container.style.opacity = "1"), 10);
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("hidden");
        } else {
          entry.target.classList.add("hidden");
        }
      });
    },
    { threshold: 0, root: container }
  );
};

const checkImage = (i = 0) => {
  const posibleImgs = [
    "../android-chrome-512x512.png",
    "../logo.png",
    "../favicon.ico",
    "../public/android-chrome-512x512.png",
    "../public/logo.png",
    "../public/favicon.ico",
    "../../public/android-chrome-512x512.png",
    "../../public/logo.png",
    "../../public/favicon.ico",
    "./android-chrome-512x512.png",
    "./logo.png",
    "./favicon.ico",
  ];

  try {
    const img = new Image();
    img.src = posibleImgs[i];
    img.onload = () => {
      console.debug({ i, icon: posibleImgs[i] });
      _logger.toggleIcon = (show: any) => {
        container.style.backgroundImage = show ? `url("${posibleImgs[i]}")` : "none";
      };
      _logger.toggleIcon(true);
    };
    img.onerror = () => {
      i++;
      if (i < posibleImgs.length) checkImage(i);
    };
  } catch (e) {}
};
