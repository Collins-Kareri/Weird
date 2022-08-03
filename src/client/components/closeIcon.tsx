import React from "react";

function Close({ backgroundColor, shadowColor, fillColor, strokeColor, position, onClick }: IconProps) {
    return (
        <div
            className={`${backgroundColor} tw-h-10 tw-w-10 tw-p-1 tw-text-center tw-rounded-full ${position} tw-cursor-pointer tw-shadow-inner ${shadowColor}`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`tw-h-7 tw-w-7 ${strokeColor} ${fillColor} tw-container tw-mx-auto tw-mt-0.5`}
                viewBox="0 0 20 20"
                onClick={onClick}
            >
                <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                />
            </svg>
        </div>
    );
}

export default Close;
