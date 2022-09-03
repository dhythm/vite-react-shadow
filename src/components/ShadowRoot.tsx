import { FC, ReactNode, useEffect, useRef } from "react";
import { addEventListenerToAllNodes } from "../utils/addEventListenerRecursive";

type Props = {
  children: ReactNode;
};
export const ShadowRoot: FC<Props> = ({ children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    let unsubscribeCapture: any;
    let unsubscribeCustom: any;
    if (ref.current?.childNodes) {
      unsubscribeCapture = addEventListenerToAllNodes(
        ref.current?.childNodes,
        "click",
        (e) => {
          console.count("----- shadow root: capturing -----");
          e.stopImmediatePropagation();
          e.target?.dispatchEvent(
            new MouseEvent("custom-click", {
              bubbles: false,
              cancelable: false,
              composed: false,
            })
          );
        },
        true
      );
      unsubscribeCustom = addEventListenerToAllNodes(
        ref.current?.childNodes,
        "custom-click",
        (e) => {
          if (e.currentTarget === e.target) {
            console.count("----- custom-click -----");
            console.log(e.target);
            console.log(e);
          }
        }
      );
    }

    return () => {
      unsubscribeCapture?.();
      unsubscribeCustom?.();
    };
  }, [ref]);
  return <div ref={ref}>{children}</div>;
};
