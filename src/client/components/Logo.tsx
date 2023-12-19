/* eslint-disable prettier/prettier */
import React from "react";
import { Link } from "react-router-dom";
import AppLogo from "@assets/logo.svg";

interface LogoProps {
    height?: `${number}`;
    width?: `${number}`;
    header?: boolean;
    extraTwClasses?: string;
}

function Logo({ height = "50", width = "50", header = false, extraTwClasses = "" }: LogoProps) {
    return (
        <Link to="/" className="tw-flex tw-items-center tw-gap-1 tw-w-fit">
            <span>
                <img
                    className={`tw-inline-block tw-cursor-pointer ${typeof extraTwClasses !== "undefined" && extraTwClasses
                        }`}
                    src={AppLogo as string}
                    height={height}
                    width={width}
                    alt="Weird"
                />
            </span>
            {header ? <h1 className="tw-text-lg tw-uppercase tw-hidden tw-font-LogoFont tw-font-semibold md:tw-inline-block">weird</h1> : <></>}
        </Link>
    );
}

export default Logo;
