import React from "react";
import { Outlet } from "react-router-dom";

function Root() {
    return (
        <>
            <nav>to be implemented</nav>
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default Root;
