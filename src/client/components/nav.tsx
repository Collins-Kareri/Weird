import React from "react";
import MyLink from "@components/link";

function My_Nav() {
    return (
        <nav className="tw-flex tw-sticky tw-z-50 tw-top-0 tw-w-full tw-justify-center tw-items-center tw-font-extrabold tw-flex-wrap tw-py-5 tw-bg-primary-200 tw-shadow-sm tw-shadow-primary-200">
            <MyLink replaceHistory={false} navigateTo={"/createAccount"} name={"create account"} />
            <MyLink replaceHistory={true} navigateTo={"/login"} name={"login"} />
            <MyLink replaceHistory={false} navigateTo={"/publish"} name={"publish"} />
            <MyLink replaceHistory={true} navigateTo={"/profile"} name={"profile"} />
        </nav>
    );
}

export default My_Nav;
