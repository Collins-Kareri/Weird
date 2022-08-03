import React from "react";

function Add({ backgroundColor, shadowColor, fillColor, strokeColor, position, onClick }: IconProps) {
    return (
        <div
            className={`${backgroundColor} tw-h-10 tw-w-10 tw-p-1 tw-text-center tw-rounded-full ${position} tw-cursor-pointer tw-shadow-inner ${shadowColor}`}
            onClick={onClick}
        >
            <svg
                className={`tw-h-7 tw-w-7 ${strokeColor} ${fillColor} tw-container tw-mx-auto tw-mt-0.5`}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
        </div>
    );
}

export default Add;
