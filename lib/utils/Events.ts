const CustomEvents = {
  setToInput: (inputId: string, value: any) => {
    const queryInput = document.getElementById(inputId);
    if (!queryInput) return;
    (Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value") as any).set.call(queryInput, value);
    queryInput.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  },
  // CustomEvents.listnToOutsideClick({ event: () => this.toggle(false), selector: this.container });
  listnToOutsideClick: ({ event, selector }: { event: () => void; selector: HTMLElement }) => {
    const outsideClickListener = (event: MouseEvent) => {
      if (!selector.contains(event.target as Node)) {
        (event as any)();
        removeClickListener();
      }
    };
    const removeClickListener = () => {
      document.removeEventListener("click", outsideClickListener);
    };
    document.addEventListener("click", outsideClickListener);
  },
};
export default CustomEvents;
