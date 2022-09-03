export const addEventListenerRecursive = (
  type: string,
  listener: any,
  options?: any
): (() => void) => {
  const addListener = () => {
    Array.from(document.querySelectorAll("*")).forEach((el) => {
      el.addEventListener(type, listener, options);
    });
  };
  const removeListener = () => {
    Array.from(document.querySelectorAll("*")).forEach((el) => {
      el.removeEventListener(type, listener, options);
    });
  };

  addListener();
  const timer = setInterval(() => {
    addListener();
  }, 1000);
  return () => {
    clearInterval(timer);
    removeListener();
  };
};
