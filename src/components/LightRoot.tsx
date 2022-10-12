import { FC, ReactNode, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
};
export const LightRoot: FC<Props> = ({ children }) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  // This event listener will be called when the button in Shadow DOM is clicked,
  // because the paths include window/document and handler is invoked forcefully.
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

  return <div ref={setRef}>{children}</div>;
};
