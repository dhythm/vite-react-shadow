import { FC, ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
};
export const LightRoot: FC<Props> = ({ children }) => {
  return <>{children}</>;
};
