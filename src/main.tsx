import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

export const listeners: any[] = [];

[window, document, Element.prototype, EventTarget.prototype].forEach(
  (eventTarget) => {
    // [window, document, document.documentElement].forEach(function (eventTarget) {
    const nativeAddEventListener = eventTarget.addEventListener;
    const nativeRemoveEventListener = eventTarget.removeEventListener;

    eventTarget.addEventListener = function (
      ...args: [
        string,
        EventListenerOrEventListenerObject,
        boolean | AddEventListenerOptions | undefined
      ]
    ) {
      // https://jsfiddle.net/tomas1000r/RDW7F/
      this.addEventListener = nativeAddEventListener;
      this.addEventListener(
        args[0],
        (e) => {
          console.log({ e });
        },
        args[2]
      );
      console.log(args);
      listeners.push({
        type: args[0],
        handler: args[1],
        options: args[2],
      });
    };
  }
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
