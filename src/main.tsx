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
          !listeners.find((v) =>
            deepEqual(
              {
                type: v.type,
                // handler: v.handler,
                options: v.options,
              },
              {
                type: args[0],
                // handler: args[1],
                options: args[2],
              }
            )
          )
        ) {
          console.count("debug");
          console.log({
            type: args[0],
            handler: args[1],
            options: args[2],
          });
          handler = function (event: any) {
            (args[1] as any)(event);
          };
          listeners.push({
            type: args[0],
            handler: args[1],
            options: args[2],
          });
        }
      }
      // nativeRemoveEventListener.call(this, args[0], handler, args[2]);
      nativeAddEventListener.call(this, args[0], handler, args[2]);
      //   let handler = args[1];
      //   if (typeof args[1] === "function") {
      //     const _handler = args[1];
      //     handler = (event: any) => {
      //       if (
      //         !listeners.find(
      //           (listener) =>
      //             listener.type === args[0] &&
      //             // listener.handler === args[1] &&
      //             listener.options === args[2]
      //         )
      //       ) {
      //         console.log({ event });
      //         listeners.push({
      //           type: args[0],
      //           handler: args[1],
      //           options: args[2],
      //         });
      //       }
      //       _handler(event);
      //     };
      //   }

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
