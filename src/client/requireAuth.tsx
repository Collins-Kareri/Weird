import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Modal from "@components/modal";
import checkAuth from "@clientUtils/checkAuth";

function RequireAuth() {
    const [isAuth, setIsAuth] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        (async () => {
            const authStatus = await checkAuth();
            setIsAuth(authStatus);
        })();
        return;
    }, []);

    function handleModalPrimaryAction() {
        navigate("/login", { state: { from: location.pathname } });
    }

    return isAuth ? (
        <Outlet />
    ) : (
        <Modal
            secondaryAction={true}
            message={"You need to login first"}
            handlePrimaryAction={handleModalPrimaryAction}
            primaryActionValue={"login"}
        />
    );
}

export default RequireAuth;
