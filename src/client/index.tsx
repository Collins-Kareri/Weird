import React from "react";
import { createRoot } from "react-dom/client";
import "@client/index.css";
import App from "@client/app";

const root = createRoot(document.getElementById("app") as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
