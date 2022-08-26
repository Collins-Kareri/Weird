import React from "react";
import capitalizeFirstChar from "@clientUtils/capitalizeFirstChar";

interface PropTypes {
    label: string;
    name: string;
}

function TextArea({ label, name }: PropTypes) {
    return (
        <>
            <label htmlFor={name} className="tw-block tw-font-semibold tw-m-2 tw-text-neutral-900 tw-text-lg">
                {capitalizeFirstChar(label)}
            </label>
            <textarea
                className="tw-w-full tw-text-neutral-900 tw-bg-neutral-200 tw-rounded-md focus:tw-ring-normal-800 valid:tw-ring-success-700 tw-ring-1 tw-outline-none tw-border-none invalid:tw-ring-error-700 "
                placeholder="Photo description"
                name={name}
                id={name}
            />
        </>
    );
}

export default TextArea;
