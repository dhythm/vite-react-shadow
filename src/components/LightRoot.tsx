import { FC, ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
};
export const LightRoot: FC<Props> = ({ children }) => {
  useEffect(() => {
    const listenerCapture = (e: MouseEvent) => {
      console.count("----- light root: capturing -----");
      const paths = e.composedPath();
      const isShadowDOM = paths.some((path: any) => path?.shadowRoot);
      if (isShadowDOM) {
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
      console.count("----- light root: bubbling -----");
    };
    document.addEventListener("click", listenerCapture, true);
    document.addEventListener("click", listenerBubble);
    return () => {
      document.removeEventListener("click", listenerCapture, true);
      document.removeEventListener("click", listenerBubble);
    };
  });
  return <>{children}</>;
};
