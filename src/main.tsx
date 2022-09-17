import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

export const listeners: any[] = [];

// [window, document, Element.prototype].forEach((target) => {
// [Element.prototype].forEach((target) => {
[EventTarget.prototype].forEach((target) => {
  const nativeAddEventListener = target.addEventListener;
  const nativeRemoveEventListener = target.removeEventListener;

  target.addEventListener = function (
    ...args: [
      string,
      EventListenerOrEventListenerObject,
      boolean | AddEventListenerOptions | undefined
    ]
  ) {
    this.addEventListener = nativeAddEventListener;
    // this.addEventListener(...args);
    // this.addEventListener(
    //   args[0],
    //   (e) => {
    //     const paths = e.composedPath();
    //     const isShadowDOM = paths.some((path: any) => path?.shadowRoot);
    //     console.log({ e, isShadowDOM });
    //     if (!isShadowDOM) {
    //       return;
    //     }
    //   },
    //   args[2]
    // );
    console.log(args);
    listeners.push({
      type: args[0],
      handler: args[1],
      options: args[2],
    });
  };
  // target.addEventListener = (
  //   ...args: [
  //     string,
  //     EventListenerOrEventListenerObject,
  //     boolean | AddEventListenerOptions | undefined
  //   ]
  // ) => {
  //   nativeAddEventListener(...args);
  //   // nativeAddEventListener(
  //   //   args[0],
  //   //   (e) => {
  //   //     const paths = e.composedPath();
  //   //     const isShadowDOM = paths.some((path: any) => path?.shadowRoot);
  //   //     if (!isShadowDOM) {
  //   //       (args[1] as any)(e);
  //   //       return;
  //   //     }
  //   //     e.stopImmediatePropagation();

  //   //     if (e.type === "click") {
  //   //       console.log({
  //   //         target,
  //   //         event: e,
  //   //         type: args[0],
  //   //         handler: args[1],
  //   //         options: args[2],
  //   //       });
  //   //     }

  //   //     listeners.push({
  //   //       target,
  //   //       event: e,
  //   //       type: args[0],
  //   //       handler: args[1],
  //   //       options: args[2],
  //   //     });
  //   //   },
  //   //   args[2]
  //   // );
  // };
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
