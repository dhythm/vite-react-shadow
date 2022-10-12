import { useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import { LightRoot } from "./components/LightRoot";
import { ShadowDOM } from "./components/ShadowDOM";

function App() {
  const [countInLight, setCountInLight] = useState(0);
  const [countInShadow, setCountInShadow] = useState(0);
  const [countInShadowDeep, setCountInShadowDeep] = useState(0);

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
        <div>
          <button onClick={() => setCountInShadow((count) => count + 1)}>
            shadow Button
          </button>
          <p style={{ color: "#888888" }}>{countInShadow}</p>
        </div>
        <div>
          <ShadowDOM>
            <button onClick={() => setCountInShadowDeep((count) => count + 1)}>
              shadow Button
            </button>
            <p style={{ color: "#888888" }}>{countInShadowDeep}</p>
          </ShadowDOM>
        </div>
      </ShadowDOM>
    </div>
  );
}

export default App;
