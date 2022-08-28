import React from "react";
import capitalizeFirstChar from "@clientUtils/capitalizeFirstChar";
import Spinner from "@components/spinner";

interface ButtonStyles {
    common: string;
    primary: string;
    secondary: string;
    tertiary: string;
}

export type ButtonPropTypes = Readonly<{
    typeOfButton?: "button" | "submit";
    priority: "primary" | "secondary" | "tertiary";
    value: string;
    isLoading?: boolean;
    extraStyles?: string;
    handleClick?: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}>;

function Button({ typeOfButton, priority, value, isLoading, extraStyles, handleClick }: ButtonPropTypes): JSX.Element {
    const buttonStyles: ButtonStyles = {
        common: `tw-relative tw-inline-flex tw-items-center tw-justify-start tw-flex-row ${
            typeof extraStyles === "string" && extraStyles
        } ${
            isLoading ? "tw-cursor-wait" : "tw-cursor-pointer"
        } tw-font-Quicksand tw-text-neutral-900 tw-align-middle tw-font-medium tw-text-base tw-w-fit tw-h-fit tw-p-2.5 tw-mt-4 tw-rounded main-transition md:tw-p-3`,
        primary:
            "tw-ring-1  tw-bg-primary-800 tw-text-primary-200  hover:tw-bg-primary-900 hover:tw-ring-offset-1 hover:tw-ring-offset-primary-900 focus:tw-text-primary-400",
        secondary:
            "tw-ring-1 tw-border-solid tw-ring-primary-300 hover:tw-ring-offset-1 hover:tw-ring-primary-800 focus:tw-ring-offset-1 focus:tw-ring-primary-800",
        tertiary: "tw-underline hover:tw-underline-offset-2 focus:tw-underline-offset-2",
    };

    return (
        <button
            onClick={handleClick}
            className={`${buttonStyles.common} ${buttonStyles[priority]}`}
            type={typeOfButton}
            disabled={isLoading ? true : false}
        >
            {isLoading && (
                <Spinner
                    height={"tw-h-6"}
                    width={"tw-h-6"}
                    borderColor={"tw-border-primary-200"}
                    position={"tw-mr-2"}
                />
            )}
            {capitalizeFirstChar(value)}
        </button>
    );
}

export default Button;
