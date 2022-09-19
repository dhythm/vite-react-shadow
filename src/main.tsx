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
      let handler = args[1];
      if (typeof args[1] === "function") {
        if (
          !listeners.find((v) => {
            return deepEqual(
              {
                type: v.type,
                options: v.options,
              },
              {
                type: args[0],
                options: args[2],
              }
            );
          })
        ) {
          console.log({
            type: args[0],
            handler: args[1],
            options: args[2],
          });
          handler = function (event: any) {
            // if (event.type?.endswith("click")) {
            //   console.log({ event, args });
            // }
            if (event.type === "react-click") {
              console.log({ event, args });
            }
            (args[1] as any)(event);
          };
          listeners.push({
            type: args[0],
            // handler: args[1],
            handler,
            options: args[2],
          });
        }
      }
      // nativeRemoveEventListener.call(this, args[0], args[1], args[2]);
      nativeAddEventListener.call(this, args[0], handler, args[2]);

      //   // https://gist.github.com/pmuellr/854959
      //   // nativeAddEventListener.apply(this, args);
      //   nativeAddEventListener.call(this, args[0], handler, args[2]);

      //   // https://jsfiddle.net/tomas1000r/RDW7F/
      //   // this.addEventListener = nativeAddEventListener;
    };
  }
);

function deepEqual(obj1: any, obj2: any) {
  if (obj1 === obj2) {
    return true;
  } else if (isObject(obj1) && isObject(obj2)) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false;
    }
    for (var prop in obj1) {
      if (!deepEqual(obj1[prop], obj2[prop])) {
        return false;
      }
    }
    return true;
  }
  function isObject(obj: unknown) {
    if (typeof obj === "object" && obj != null) {
      return true;
    } else {
      return false;
    }
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
