import React from "react";
import { createRoot } from "react-dom/client";
import "@client/index.css";
import App from "@client/app";

const container = document.getElementById("app")!;
const root = createRoot(container);
root.render(<App />);
