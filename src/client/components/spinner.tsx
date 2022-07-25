import React from "react";

interface SpinnerPropTypes {
    height: string;
    width: string;
    borderColor: string;
    margin: string;
    extraStyles?: string;
}

function Spinner({ height, width, borderColor, margin, extraStyles }: SpinnerPropTypes): JSX.Element {
    return (
        <span
            className={`tw-inline-block tw-animate-spin ${height} ${width} tw-w-6 ${margin} ${borderColor} tw-border-solid tw-border-t-2 tw-border-r-2 tw-rounded-full ${
                typeof extraStyles !== "undefined" && extraStyles
            }`}
        ></span>
    );
}

export default Spinner;
