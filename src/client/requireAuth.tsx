import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Modal from "@components/modal";

function RequireAuth() {
    const [isAuth, setIsAuth] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function checkAuth() {
            const authenticated = await (await fetch("/api/auth", { method: "get" })).json();

            if (authenticated.user) {
                setIsAuth(true);
                return;
            }

            setIsAuth(false);
            return;
        }
        checkAuth();
    }, []);

    function handleModalPrimaryAction() {
        navigate("/login");
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
