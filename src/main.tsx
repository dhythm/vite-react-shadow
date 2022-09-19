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
      if (typeof args[1] === "function") {
        const listener = args[1];
        args[1] = (event: any) => {
          if (
            !listeners.find(
              (listener) =>
                listener.type === args[0] &&
                listener.handler === args[1] &&
                listener.options === args[2]
            )
          ) {
            listeners.push({
              type: args[0],
              handler: args[1],
              options: args[2],
            });
          }
          listener(event);
        };
      }

      // https://gist.github.com/pmuellr/854959
      nativeAddEventListener.apply(this, args);

      // https://jsfiddle.net/tomas1000r/RDW7F/
      this.addEventListener = nativeAddEventListener;
    };
  }
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
