/* eslint-disable react/prop-types */
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

export function LogoTypeFace(props: React.ComponentProps<"h1">) {
    const baseStyles = "tw-font-LogoFont tw-font-semibold tw-uppercase tw-tracking-wider";

    return <h1 className={`${baseStyles} ${props.className}`}>weird</h1>
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
            {header ? <LogoTypeFace className="tw-hidden md:tw-inline-block tw-text-lg" /> : <></>}
        </Link>
    );
}

export default Logo;
