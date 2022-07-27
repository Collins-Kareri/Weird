import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@pages/home";
import CreateAccount from "@pages/createAccount/createAccount";
import Login from "@pages/login";
import "@client/app.css";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="createAccount" element={<CreateAccount />} />
            <Route path="login" element={<Login />} />
        </Routes>
    );
}

export default App;
