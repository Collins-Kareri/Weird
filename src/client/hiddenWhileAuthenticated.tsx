import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import checkAuth from "@clientUtils/checkAuth";
import { useUser } from "@context/user.context";

function HiddenWhileAuthenticated() {
    const [isAuth, setIsAuth] = useState(false);
    const { setUser } = useUser();

    useEffect(() => {
        (async () => {
            const isAuthenticated = await checkAuth();
            setUser(isAuthenticated.user);
            setIsAuth(isAuthenticated.authStatus);
        })();
        return;
    }, []);

    return isAuth ? <Navigate to={"/profile"} /> : <Outlet />;
}

export default HiddenWhileAuthenticated;
