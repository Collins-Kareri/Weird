import React from "react";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="tw-flex tw-h-screen tw-w-full tw-justify-center tw-items-center tw-font-extrabold">
            <Link
                className="tw-underline tw-text-normal-500 tw-font-Taviraj tw-text-xl tw-uppercase tw-mr-4"
                to={"/createAccount"}
            >
                create account
            </Link>
            <Link className="tw-underline tw-text-normal-500 tw-font-Taviraj tw-uppercase tw-text-xl" to={"/login"}>
                login
            </Link>
        </div>
    );
}

export default Home;
