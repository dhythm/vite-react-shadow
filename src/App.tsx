import { RefCallback, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { ShadowDOM } from "./components/ShadowDOM";
import { ShadowRoot } from "./components/ShadowRoot";
import { LightRoot } from "./components/LightRoot";
import { listeners } from "./main";

function App() {
  const [countInLight, setCountInLight] = useState(0);
  const [countInShadow, setCountInShadow] = useState(0);

  const listener = (e: MouseEvent) => {
    const paths = e.composedPath();
    const isShadowDOM = paths.some((path: any) => path?.shadowRoot);
    if (isShadowDOM) {
      e.stopImmediatePropagation();
    }
  };

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
          <button onClick={() => setCountInLight((count) => count + 1)}>
            count is {countInLight}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </LightRoot>
      <ShadowDOM>
        <ShadowRoot>
          <div>
            <div>
              <button onClick={() => setCountInShadow((count) => count + 1)}>
                shadow Button
              </button>
            </div>
            <div>
              <p style={{ color: "#888888" }}>{countInShadow}</p>
            </div>
          </div>
        </ShadowRoot>
      </ShadowDOM>
    </div>
  );
}

export default App;
