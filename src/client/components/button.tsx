import React from "react";
import capitalizeFirstChar from "@client/utils/capitalizeFirstChar";

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
    classUtilities?: string;
    handleClick?: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}>;

function Button({ typeOfButton, priority, value, handleClick }: ButtonPropTypes): JSX.Element {
    const buttonStyles: ButtonStyles = {
        common: "tw-relative tw-inline-block tw-font-Quicksand tw-font-medium tw-text-base tw-w-fit tw-h-fit tw-p-2.5 tw-m-3.5 tw-rounded main-transition md:tw-p-3",
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
        >
            {capitalizeFirstChar(value)}
        </button>
    );
}

export default Button;
