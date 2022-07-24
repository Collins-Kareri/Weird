import React from "react";

export type CheckBoxPropTypes = {
    label: string;
    name: string;
    value: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function CheckBox({ label, name, value, handleChange }: CheckBoxPropTypes): JSX.Element {
    return (
        <div className="tw-px-4 tw-pb-4">
            <input onChange={handleChange} className="tw-mr-2" type="checkbox" value={value} name={name} />
            <label className="tw-font-Quicksand tw-font-medium" htmlFor={name}>
                {label}
            </label>
        </div>
    );
}

export default CheckBox;
