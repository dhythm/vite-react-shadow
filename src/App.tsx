import { RefCallback, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { ShadowDOM } from "./components/ShadowDOM";
import { ShadowRoot } from "./components/ShadowRoot";
import { LightRoot } from "./components/LightRoot";

const listeners: any[] = [];

[window, document, Element.prototype].forEach((target) => {
  const nativeAddEventListener = target.addEventListener;
  target.addEventListener = (
    ...args: [
      string,
      EventListenerOrEventListenerObject,
      boolean | AddEventListenerOptions | undefined
    ]
  ) => {
    nativeAddEventListener(...args);
    listeners.push({
      target,
      args,
    });
  };
});

function App() {
  const [count, setCount] = useState(0);

  const listener = (e: MouseEvent) => {
    const paths = e.composedPath();
    const isShadowDOM = paths.some((path: any) => path?.shadowRoot);
    if (isShadowDOM) {
      console.log({ paths, isShadowDOM, target: e.target });
      e.stopImmediatePropagation();
      const key =
        Object.keys(paths[0]).find((key) => key.match(/^__reactProps\$.+$/)) ??
        "";
      const reactProps = (paths[0] as any)[key] as any;
      const handlers = Object.keys(reactProps).filter((key) =>
        key.match(/^on[A-Z]/)
      );
      handlers.forEach((handler) => {
        reactProps[handler]();
      });
      // paths[0].dispatchEvent(
      //   new MouseEvent("custom-click", {
      //     bubbles: false,
      //     cancelable: false,
      //     composed: false,
      //   })
      // );
      // e.target?.dispatchEvent(
      //   new MouseEvent("custom-click", {
      //     bubbles: false,
      //     cancelable: false,
      //     composed: false,
      //   })
      // );
    }
  };

  const eligibleListeners = listeners
    .filter((v, i) => {
      if (window.self === v.target) return false;
      if (document === v.target) return false;
      if (listeners.findIndex((u) => v.args[0] === u.args[0]) !== i)
        return false;
      return true;
    })
    .map(({ target, args }) => args);

  useEffect(() => {
    console.log(eligibleListeners);
    // eligibleListeners.forEach((v) => {
    //   if (v.args[0] !== "click") return;
    //   window.addEventListener(
    //     v.args[0],
    //     (e) => {
    //       const paths = e.composedPath();
    //       const isShadowDOM = paths.some((path: any) => path?.shadowRoot);
    //       if (isShadowDOM) {
    //         e.stopImmediatePropagation();
    //         console.log(v.args[1]);
    //         v.args[1](e);
    //       }
    //     },
    //     true
    //   );
    // });
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
