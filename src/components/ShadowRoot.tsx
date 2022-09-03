import { FC, ReactNode, useEffect, useRef } from "react";
import { addEventListenerToAllNodes } from "../utils/addEventListenerRecursive";

let didInit = false;

type Props = {
  children: ReactNode;
};
export const ShadowRoot: FC<Props> = ({ children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    let unsubscribeCapture: any;
    let unsubscribeCustom: any;
    if (!didInit && ref.current?.childNodes) {
      didInit = true;
      unsubscribeCapture = addEventListenerToAllNodes(
        ref.current?.childNodes,
        "click",
        (e) => {
          console.count(
            `----- shadow root: capturing at ${
              (e.currentTarget as any)?.nodeName
            } -----`
          );
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
            console.count(
              `----- custom-click at ${(e.target as any)?.nodeName} -----`
            );
            console.log(e);
          }
        }
      );
    }

    return () => {
      unsubscribeCapture?.();
      unsubscribeCustom?.();
    };
  }, [ref, didInit]);
  return <div ref={ref}>{children}</div>;
};
