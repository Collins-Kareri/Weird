import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";

function Root() {
    return (
        <>
            <Nav />
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default Root;
