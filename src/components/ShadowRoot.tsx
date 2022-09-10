import { FC, ReactNode, useEffect, useRef } from "react";
import { addEventListenerToAllNodes } from "../utils/addEventListenerRecursive";

type Props = {
  children: ReactNode;
};
export const ShadowRoot: FC<Props> = ({ children }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const listener = (e: Event | MouseEvent) => {
    if (e.currentTarget === e.target) {
      console.count(
        `----- custom-click at ${(e.target as any)?.nodeName} -----`
      );
      const node = (e as any).path[0];
      const key =
        Object.keys(node).find((key) => key.match(/^__reactProps\$.+$/)) ?? "";
      node?.[key]?.onClick?.();
    }
  };

  useEffect(() => {
    let unsubscribeCustom: any;
    if (ref.current?.childNodes) {
      unsubscribeCustom = addEventListenerToAllNodes(
        ref.current?.childNodes,
        "custom-click",
        listener
      );
    }

    return () => {
      console.count("----- clean up -----");
      unsubscribeCustom?.();
    };
  }, [ref]);
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
