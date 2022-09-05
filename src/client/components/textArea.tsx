import React, { useState } from "react";
import capitalizeFirstChar from "@clientUtils/capitalizeFirstChar";

interface PropTypes {
    label: string;
    name: string;
    placeHolder: string;
    value?: string;
    handleChange?: (evt: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

function TextArea({ label, name, placeHolder, value, handleChange }: PropTypes) {
    const [currentValue, setCurrentValue] = useState(value);

    return (
        <div className="tw-text-neutral-900 tw-flex tw-flex-col tw-items-stretch tw-my-2 tw-font-Quicksand tw-text-lg tw-w-full tw-container tw-mx-auto">
            <label htmlFor={name} className="tw-block tw-font-semibold tw-m-2 tw-text-neutral-900 tw-text-lg">
                {capitalizeFirstChar(label)}
            </label>
            <textarea
                className="tw-w-full tw-text-neutral-900 tw-bg-neutral-200 tw-rounded-md focus:tw-ring-normal-800 valid:tw-ring-success-700 tw-ring-1 tw-outline-none tw-border-none invalid:tw-ring-error-700 "
                placeholder={placeHolder}
                name={name}
                id={name}
                value={currentValue}
                onChange={(evt) => {
                    setCurrentValue(evt.target.value);
                    return handleChange ? handleChange(evt) : undefined;
                }}
            />
        </div>
    );
}

export default TextArea;
