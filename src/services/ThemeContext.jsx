import React, { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [bgtheme, setbgTheme] = useState(
    localStorage.getItem("bgtheme") || "white"
  );
  const [texttheme, settextTheme] = useState(
    localStorage.getItem("texttheme") || "dark"
  );
  const [textSize, setTextSize] = useState(
    localStorage.getItem("textSize") || "default"
  );

  useEffect(() => {
    localStorage.setItem("bgtheme", bgtheme);
    localStorage.setItem("texttheme", texttheme);
  }, [bgtheme, texttheme]);

  useEffect(() => {
    localStorage.setItem("textSize", textSize);
    document.documentElement.setAttribute("data-text-size", textSize);
  }, [textSize]);

  return (
    <ThemeContext.Provider
      value={{
        bgtheme,
        texttheme,
        setbgTheme,
        settextTheme,
        textSize,
        setTextSize,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
