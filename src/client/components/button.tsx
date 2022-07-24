import React from "react";
import capitalizeFirstChar from "@clientUtils/capitalizeFirstChar";

type ButtonStyles = {
    common: string;
    primary: string;
    secondary: string;
    tertiary: string;
};

export type ButtonPropTypes = Readonly<{
    typeOfButton?: "button" | "submit";
    priority: "primary" | "secondary" | "tertiary";
    value: string;
    isLoading?: boolean;
    handleClick?: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}>;

function Spinner() {
    return (
        <span className="tw-inline-block tw-animate-spin tw-h-6 tw-w-6 tw-mr-2  tw-border-black tw-border-solid tw-border-t-2 tw-border-r-2 tw-rounded-full"></span>
    );
}

function Button({ typeOfButton, priority, value, isLoading, handleClick }: ButtonPropTypes): JSX.Element {
    const selectCursor = isLoading ? "tw-cursor-not-allowed" : "tw-cursor-pointer";

    console.log(isLoading);

    const buttonStyles: ButtonStyles = {
        common: `tw-relative tw-inline-flex tw-items-center tw-justify-start tw-flex-row ${selectCursor} tw-font-Quicksand tw-align-middle tw-font-medium tw-text-base tw-w-fit tw-h-fit tw-p-2.5 tw-m-3.5 tw-rounded main-transition md:tw-p-3`,
        primary: "tw-bg-gray-300 hover:tw-drop-shadow-lg focus:tw-drop-shadow-lg",
        secondary:
            "tw-ring-1 tw-border-solid tw-ring-gray-400 hover:tw-ring-offset-1 hover:tw-ring-gray-900 focus:tw-ring-offset-1 focus:tw-ring-gray-900",
        tertiary: "tw-underline hover:tw-underline-offset-2 focus:tw-underline-offset-2",
    };

    return (
        <button
            onClick={handleClick}
            className={`${buttonStyles.common} ${buttonStyles[priority]}`}
            type={typeOfButton}
            disabled={isLoading ? true : false}
        >
            {isLoading && <Spinner />}
            {capitalizeFirstChar(value)}
        </button>
    );
}

export default Button;
