import React from "react";

function Search({ fillColor, strokeColor }: { fillColor: string; strokeColor: string }) {
    return (
        <svg
            className={`tw-h-5 tw-w-5 ${strokeColor} ${fillColor}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
        </svg>
    );
}

export default Search;