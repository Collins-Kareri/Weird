import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Popover from "@src/client/components/popover";
import checkAuth from "@clientUtils/checkAuth";
import { useUser } from "@context/user.context";

function RequireAuth() {
    const [isAuth, setIsAuth] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useUser();

    useEffect(() => {
        (async () => {
            const isAuthenticated = await checkAuth();

            setUser(isAuthenticated.user);
            setIsAuth(isAuthenticated.authStatus);
        })();
        return;
    }, []);

    function handlePopoverPrimaryAction() {
        navigate("/login", { state: { from: location.pathname } });
    }

    return isAuth ? (
        <Outlet />
    ) : (
        <Popover
            secondaryAction={true}
            message={"You need to login first."}
            handlePrimaryAction={handlePopoverPrimaryAction}
            primaryActionValue={"login"}
        />
    );
}

export default RequireAuth;
