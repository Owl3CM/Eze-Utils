const CustomEvents = {
  setToInput: (inputId: string, value: any) => {
    const queryInput = document.getElementById(inputId);
    if (!queryInput) return;
    (Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value") as any).set.call(queryInput, value);
    queryInput.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  },
};
export default CustomEvents;
