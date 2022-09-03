import { FC, ReactNode, useEffect } from "react";

let didInit = false;

type Props = {
  children: ReactNode;
};
export const ShadowRoot: FC<Props> = ({ children }) => {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      document.addEventListener("click", (e) => {
        console.log("---------- shadow root ----------");
        console.log(e);
      });
      return () => {
        document.removeEventListener("click", (e) => {
          console.log(e);
        });
      };
    }
  });
  return <>{children}</>;
};
