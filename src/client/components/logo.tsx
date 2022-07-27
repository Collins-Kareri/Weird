import React from "react";
import { Link } from "react-router-dom";
import AppLogo from "@assets/logo.svg";

interface LogoProps {
    height: `${number}`;
    width: `${number}`;
    header: boolean;
    extraTwClasses?: string;
}

function Logo({ height, width, header, extraTwClasses }: LogoProps) {
    return (
        <>
            <Link to="/login">
                <img
                    className={`tw-inline-block tw-cursor-pointer ${
                        typeof extraTwClasses !== "undefined" && extraTwClasses
                    }`}
                    src={AppLogo as string}
                    height={height}
                    width={width}
                    alt="Weird"
                />
            </Link>
            {header && (
                <h1 className="tw-font-Taviraj tw-font-medium tw-text-lg tw-uppercase tw-inline-block">weird</h1>
            )}
        </>
    );
}

export default Logo;
