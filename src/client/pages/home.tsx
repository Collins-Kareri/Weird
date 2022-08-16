import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="tw-flex tw-h-screen tw-w-full tw-justify-center tw-items-center tw-font-extrabold">
            <Link
                className="tw-underline tw-text-normal-500 tw-font-Taviraj tw-text-xl tw-uppercase tw-mr-4"
                to={"/createAccount"}
                onClick={async (evt) => {
                    evt.preventDefault();
                    navigate("/createAccount", { state: { from: location.pathname }, replace: false });
                    return;
                }}
            >
                create account
            </Link>
            <Link
                className="tw-underline tw-text-normal-500 tw-font-Taviraj tw-uppercase tw-text-xl tw-mr-4"
                to={"/login"}
                onClick={async (evt) => {
                    evt.preventDefault();
                    navigate("/login", { state: { from: location.pathname }, replace: true });
                    return;
                }}
            >
                login
            </Link>
            <Link
                className="tw-underline tw-text-normal-500 tw-font-Taviraj tw-uppercase tw-text-xl tw-mr-4"
                to={"/publish"}
                onClick={(evt) => {
                    evt.preventDefault();
                    navigate("/publish", { state: { path: location.pathname }, replace: false });
                    return;
                }}
            >
                publish
            </Link>
        </div>
    );
}

export default Home;
