import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import SchoolLife from "./App";
import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("School Life could not find its application root.");
}

createRoot(root).render(
  <StrictMode>
    <SchoolLife />
  </StrictMode>,
);
