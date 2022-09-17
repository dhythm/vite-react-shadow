import { FC, ReactNode, useEffect, useRef } from "react";
import { addEventListenerToAllNodes } from "../utils/addEventListenerRecursive";

type Props = {
  children: ReactNode;
};
export const ShadowRoot: FC<Props> = ({ children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  return <div ref={ref}>{children}</div>;
};
