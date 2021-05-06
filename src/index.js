import { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./App";
import Slot from "./Slot";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <Slot />
  </StrictMode>,
  rootElement
);
