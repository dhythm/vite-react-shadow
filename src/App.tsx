import { RefCallback, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { ShadowDOM } from "./components/ShadowDOM";
import { ShadowRoot } from "./components/ShadowRoot";
import { LightRoot } from "./components/LightRoot";

const listeners: any[] = [];

// [window, document, Element.prototype].forEach((target) => {
[document, Element.prototype].forEach((target) => {
  const nativeAddEventListener = target.addEventListener;
  target.addEventListener = (
    ...args: [
      string,
      EventListenerOrEventListenerObject,
      boolean | AddEventListenerOptions | undefined
    ]
  ) => {
    // nativeAddEventListener(...args);
    listeners.push({
      target,
      type: args[0],
      handler: args[1],
      options: args[2],
    });
  };
});

function App() {
  const [count, setCount] = useState(0);

  const listener = (e: MouseEvent) => {
    const paths = e.composedPath();
    const isShadowDOM = paths.some((path: any) => path?.shadowRoot);
    if (isShadowDOM) {
      // console.log({ paths, isShadowDOM, target: e.target });
      e.stopImmediatePropagation();
      const listenersCapturing: any[] = [];
      const listenersBubbling: any[] = [];
      paths.reverse().forEach((path) => {
        if (path === window.self || path === document) {
          const { target: _t1, ..._listenerCapturing } =
            listeners.find(
              (v) =>
                v.type === "click" && v.target === path && v.options === true
            ) ?? {};
          const { target: _t2, ..._listenerBubbling } =
            listeners.find(
              (v) =>
                v.type === "click" && v.target === path && v.options === false
            ) ?? {};
          if (!!_t1 && _listenerCapturing)
            listenersCapturing.push(_listenerCapturing);
          if (!!_t2 && _listenerBubbling)
            listenersBubbling.push(_listenerBubbling);
          return;
        }
        const { target: _t1, ..._listenerCapturing } =
          listeners.find(
            (v) =>
              v.type === "click" &&
              v.target !== window.self &&
              v.target !== document &&
              v.options === true
          ) ?? {};
        const { target: _t2, ..._listenerBubbling } =
          listeners.find(
            (v) =>
              v.type === "click" &&
              v.target !== window.self &&
              v.target !== document &&
              v.options === false
          ) ?? {};
        if (!!_t1 && _listenerCapturing)
          listenersCapturing.push(_listenerCapturing);
        if (!!_t2 && _listenerBubbling)
          listenersBubbling.push(_listenerBubbling);
      });
      const _listeners = listenersCapturing
        .concat(listenersBubbling.reverse())
        .filter((v) => v);
      _listeners.forEach((listener) => {
        listener.handler(e);
      });
      // const key =
      //   Object.keys(paths[0]).find((key) => key.match(/^__reactProps\$.+$/)) ??
      //   "";
      // const reactProps = (paths[0] as any)[key] as any;
      // const handlers = Object.keys(reactProps).filter((key) =>
      //   key.match(/^on[A-Z]/)
      // );
      // handlers.forEach((handler) => {
      //   reactProps[handler]();
      // });
      // paths[0].dispatchEvent(
      //   new MouseEvent("custom-click", {
      //     bubbles: false,
      //     cancelable: false,
      //     composed: false,
      //   })
      // );
    }
  };

  useEffect(() => {
    window.addEventListener("click", listener, true);
    return () => {
      window.removeEventListener("click", listener, true);
    };
  }, []);

  return (
    <div className="App">
      <LightRoot>
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" className="logo" alt="Vite logo" />
          </a>
          <a href="https://reactjs.org" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
        <ShadowDOM>
          <ShadowRoot>
            <div>
              <div>
                <button
                  onClick={(e) => {
                    console.log("clicked");
                  }}
                >
                  shadow Button
                </button>
              </div>
              <div>
                <p>Hello</p>
              </div>
            </div>
          </ShadowRoot>
        </ShadowDOM>
      </LightRoot>
    </div>
  );
}

export default App;
