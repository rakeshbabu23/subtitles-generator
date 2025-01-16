import { ReactNode } from "react";

const Container = ({ children }: { children: ReactNode }) => {
  return <div className="max-w-4xl mx-auto">{children}</div>;
};

export default Container;
