import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "@client/index.css";
import Root from "./Layouts/root";
import Home from "./pages/home";
import ErrorPage from "./pages/error-page";
import { ChakraProvider } from "@chakra-ui/react";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "",
                element: <Home />,
            },
        ],
    },
]);

const root = createRoot(document.getElementById("app") as HTMLElement);
root.render(
    <React.StrictMode>
        <ChakraProvider>
            <RouterProvider router={router} />
        </ChakraProvider>
    </React.StrictMode>
);
