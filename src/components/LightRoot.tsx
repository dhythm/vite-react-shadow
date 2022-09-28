import { FC, ReactNode, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
};
export const LightRoot: FC<Props> = ({ children }) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const listenerCapture = (e: MouseEvent) => {
      console.count("----- light root: capturing -----");
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
  }, []);

  useEffect(() => {
    const listenerCapture = (e: MouseEvent) => {
      console.count("----- light root(ref): capturing -----");
    };
    const listenerBubble = (e: MouseEvent) => {
      console.count("----- light root(ref): bubbling -----");
    };
    if (ref) {
      ref.addEventListener("click", listenerCapture, true);
      ref.addEventListener("click", listenerBubble);
    }
    return () => {
      if (ref) {
        ref.addEventListener("click", listenerCapture, true);
        ref.addEventListener("click", listenerBubble);
      }
    };
  }, [ref]);

  return <div ref={setRef}>{children}</div>;
};
