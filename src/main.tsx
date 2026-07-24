import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import SchoolLife from "./App";
import "./styles.css";

registerSW({ immediate: true });

const root = document.getElementById("root");

if (!root) {
  throw new Error("School Life could not find its application root.");
}

createRoot(root).render(
  <StrictMode>
    <SchoolLife />
  </StrictMode>,
);
