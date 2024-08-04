import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import "./styles/theme.css";

const originalWarn = console.warn;
console.warn = function (message, ...optionalParams) {
  if (
    message.includes("-ms-high-constrast") ||
    message.includes("Third-party cookie") ||
    message.includes("No client method with the name 'groupjoined' found.") ||
    message.includes(`Each child in a list should have a unique "key" prop.`)
  ) {
    return;
  }
  originalWarn.apply(console, [message, ...optionalParams]);
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
