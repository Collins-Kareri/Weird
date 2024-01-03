import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";

function Root() {
    return (
        <>
            <Nav />
            <main className="tw-overflow-clip">
                <Outlet />
            </main>
        </>
    );
}

export default Root;
