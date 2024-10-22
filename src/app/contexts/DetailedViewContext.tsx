"use client";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface ThemeContextInterface {
  detailedView: boolean;
  toggleView: () => void;
}
const DetailedViewContext = createContext<ThemeContextInterface>(
  {} as ThemeContextInterface
);

export const DetailedViewProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [detailedView, setDetailedView] = useState<boolean>(false);

  useEffect(() => {
    const savedDetailedView = localStorage.getItem("detailedView");
    setDetailedView(savedDetailedView === "true" ? true : false);
  }, []);

  const toggleView = () => {
    console.log(detailedView);
    setDetailedView((prevView) => (prevView === true ? false : true));
    localStorage.setItem("detailedView", detailedView ? "false" : "true");
  };

  return (
    <DetailedViewContext.Provider value={{ detailedView, toggleView }}>
      {children}
    </DetailedViewContext.Provider>
  );
};

export const useDetailedView = () => useContext(DetailedViewContext);
