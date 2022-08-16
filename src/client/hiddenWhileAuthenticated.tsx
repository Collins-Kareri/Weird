import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import checkAuth from "@clientUtils/checkAuth";

function HiddenWhileAuthenticated() {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        (async () => {
            const authStatus = await checkAuth();
            setIsAuth(authStatus);
        })();
        return;
    }, []);

    return isAuth ? <Navigate to={"/publish"} /> : <Outlet />;
}

export default HiddenWhileAuthenticated;
