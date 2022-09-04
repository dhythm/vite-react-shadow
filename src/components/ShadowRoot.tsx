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
    const listener = (e: Event) => {
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
    };
    if (!didInit && ref.current?.childNodes) {
      const didInitCurrent = didInit;
      didInit = true;
      ref.current.addEventListener("click", listener, true);
      unsubscribeCapture = () => {
        if (didInitCurrent) {
          ref.current?.removeEventListener("click", listener, true);
        }
      };
      unsubscribeCustom = addEventListenerToAllNodes(
        ref.current?.childNodes,
        "custom-click",
        (e) => {
          if (e.currentTarget === e.target) {
            console.count(
              `----- custom-click at ${(e.target as any)?.nodeName} -----`
            );
            const node = (e as any).path[0];
            const key =
              Object.keys(node).find((key) =>
                key.match(/^__reactProps\$.+$/)
              ) ?? "";
            node?.[key]?.onClick?.();
          }
        }
      );
    }

    return () => {
      console.count("----- clean up -----");
      unsubscribeCapture?.();
      unsubscribeCustom?.();
    };
  }, [ref, didInit]);
  return <div ref={ref}>{children}</div>;
};

type DOMEventName =
  | "abort"
  | "afterblur" // Not a real event. This is used by event experiments.
  // These are vendor-prefixed so you should use the exported constants instead:
  // 'animationiteration' |
  // 'animationend |
  // 'animationstart' |
  | "beforeblur" // Not a real event. This is used by event experiments.
  | "beforeinput"
  | "blur"
  | "canplay"
  | "canplaythrough"
  | "cancel"
  | "change"
  | "click"
  | "close"
  | "compositionend"
  | "compositionstart"
  | "compositionupdate"
  | "contextmenu"
  | "copy"
  | "cut"
  | "dblclick"
  | "auxclick"
  | "drag"
  | "dragend"
  | "dragenter"
  | "dragexit"
  | "dragleave"
  | "dragover"
  | "dragstart"
  | "drop"
  | "durationchange"
  | "emptied"
  | "encrypted"
  | "ended"
  | "error"
  | "focus"
  | "focusin"
  | "focusout"
  | "fullscreenchange"
  | "gotpointercapture"
  | "hashchange"
  | "input"
  | "invalid"
  | "keydown"
  | "keypress"
  | "keyup"
  | "load"
  | "loadstart"
  | "loadeddata"
  | "loadedmetadata"
  | "lostpointercapture"
  | "message"
  | "mousedown"
  | "mouseenter"
  | "mouseleave"
  | "mousemove"
  | "mouseout"
  | "mouseover"
  | "mouseup"
  | "paste"
  | "pause"
  | "play"
  | "playing"
  | "pointercancel"
  | "pointerdown"
  | "pointerenter"
  | "pointerleave"
  | "pointermove"
  | "pointerout"
  | "pointerover"
  | "pointerup"
  | "popstate"
  | "progress"
  | "ratechange"
  | "reset"
  | "resize"
  | "scroll"
  | "seeked"
  | "seeking"
  | "select"
  | "selectstart"
  | "selectionchange"
  | "stalled"
  | "submit"
  | "suspend"
  | "textInput" // Intentionally camelCase. Non-standard.
  | "timeupdate"
  | "toggle"
  | "touchcancel"
  | "touchend"
  | "touchmove"
  | "touchstart"
  // These are vendor-prefixed so you should use the exported constants instead:
  // 'transitionend' |
  | "volumechange"
  | "waiting"
  | "wheel";
