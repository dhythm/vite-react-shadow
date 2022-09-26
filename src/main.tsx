import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

export const listeners: any[] = [];

function findListenerIndex(listenerObjects: any, args: any) {
  for (var i = 0; i < listenerObjects.length; i++) {
    if (
      deepEqual(
        {
          type: listenerObjects[i].type,
          handler: listenerObjects[i].handler,
          options: listenerObjects[i].options,
        },
        args
      )
    ) {
      return i;
    }
  }
  return -1;
}

type ListenerObject = {
  type: string;
  handler: EventListener;
  _handler: EventListener;
  options: boolean | AddEventListenerOptions | undefined;
};

const listenerObjectsByType: Map<string, ListenerObject[]> = new Map();

[window, document, Element.prototype, EventTarget.prototype].forEach(
  (eventTarget) => {
    const target = document.getElementById("root");

    const nativeAddEventListener = eventTarget.addEventListener;
    const nativeRemoveEventListener = eventTarget.removeEventListener;

    eventTarget.addEventListener = function (
      ...args: [
        string,
        // EventListenerOrEventListenerObject,
        EventListener,
        boolean | AddEventListenerOptions | undefined
      ]
    ) {
      let listenerObjects = listenerObjectsByType.get(args[0]);
      if (!listenerObjects) {
        listenerObjects = [];
        listenerObjectsByType.set(args[0], listenerObjects);
      }

      let listenerIndex = findListenerIndex(listenerObjects, {
        type: args[0],
        handler: args[1],
        options: args[2],
      });
      if (listenerIndex === -1) {
        const _handler = function _handler(event: any) {
          if (
            event.eventPhase === event.CAPTURING_PHASE &&
            target &&
            contains(target, event.target)
          ) {
            return;
          }
          if (event.isTrusted) {
            const paths = event.composedPath();
            const isShadowDOM = paths.some((path: any) => path?.shadowRoot);
            if (isShadowDOM) {
              event.stopImmediatePropagation();
              const listenerObjects = listenerObjectsByType.get(event.type);
              const listenerBubbling = listenerObjects?.find((v) => !v.options);
              listenerBubbling?.handler(event);
              return;
            }
            args[1].call(event.currentTarget, event);
          }
        };

        nativeAddEventListener.call(this, args[0], _handler, args[2]);

        const listenerObject = {
          type: args[0],
          handler: args[1],
          options: args[2],
          _handler,
        };
        listenerObjects.push(listenerObject);
      }
    };

    eventTarget.removeEventListener = function (
      ...args: [
        string,
        EventListener,
        boolean | AddEventListenerOptions | undefined
      ]
    ) {
      const listenerObjects = listenerObjectsByType.get(args[0]) || [];
      const listenerIndex = findListenerIndex(listenerObjects, {
        type: args[0],
        handler: args[1],
        options: args[2],
      });

      if (listenerIndex !== -1) {
        removeEventListener.call(
          eventTarget,
          args[0],
          listenerObjects[listenerIndex]._handler,
          args[2]
        );
        listenerObjects.splice(listenerIndex, 1);
      }
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

function contains(node: any, targetNode: any) {
  if (node.contains) return node.contains(targetNode);
  var el = targetNode;

  while (el) {
    if (el === node) return true;
    el = el.parentNode;
  }

  return false;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
