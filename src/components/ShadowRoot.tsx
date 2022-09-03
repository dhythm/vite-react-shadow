import { FC, ReactNode, useEffect } from "react";
import { addEventListenerRecursive } from "../utils/addEventListenerRecursive";

type Props = {
  children: ReactNode;
};
export const ShadowRoot: FC<Props> = ({ children }) => {
  useEffect(() => {
    const listenerCapture = (e: MouseEvent) => {
      console.count("----- shadow root: capturing -----");
      if (!!(e.target as any).shadowRoot) {
        e.stopImmediatePropagation();
        e.target?.dispatchEvent(
          new MouseEvent("custom-click", {
            bubbles: false,
            cancelable: false,
            composed: false,
          })
        );
      }
    };
    const listenerBubble = (e: MouseEvent) => {
      console.count("----- shadow root: bubbling -----");
    };
    document.addEventListener("click", listenerCapture, true);
    document.addEventListener("click", listenerBubble);
    const unsubscribe = addEventListenerRecursive(
      "custom-click",
      (e: MouseEvent) => {
        console.count("----- custom-click -----");
      }
    );

    return () => {
      document.removeEventListener("click", listenerCapture, true);
      document.removeEventListener("click", listenerBubble);
      unsubscribe();
    };
  });
  return <>{children}</>;
};
