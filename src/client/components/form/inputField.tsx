import React, { useState } from "react";
import capitalizeFirstChar from "@clientUtils/capitalizeFirstChar";

type InputStateStyles = Readonly<{
    normal: string;
    invalid: string;
    valid: string;
    focused: string;
}>;

export type InputPropsTypes = {
    type: string;
    label: string;
    placeholder: string;
    name: string;
    minlength?: number;
    value?: string;
    isAutoFocus?: boolean;
    isRequired?: boolean;
    helperMsg?: string;
    inputErrMsg?: string;
    handleBlur?: (evt: React.FocusEvent<HTMLInputElement>) => void;
    handleKeyup?: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
    handleChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
};

interface InformationalMsgProps {
    msg: string;
    type?: string;
    utilityClasses?: string;
}

function InformationalMsg({ msg, utilityClasses }: InformationalMsgProps): JSX.Element {
    return (
        <p className={`tw-pl-1 tw-m-1 main-transition tw-text-base ${utilityClasses ? utilityClasses : ""}`}>
            {capitalizeFirstChar(msg)}
        </p>
    );
}

function Input({
    type,
    label,
    placeholder,
    name,
    value,
    minlength,
    isRequired,
    isAutoFocus,
    helperMsg,
    inputErrMsg,
    handleBlur,
    handleKeyup,
    handleChange,
}: InputPropsTypes): JSX.Element {
    const inputStateStyles: InputStateStyles = {
        normal: " tw-w-full tw-p-3 tw-bg-neutral-200 tw-ring-1 tw-outline-none tw-rounded-lg tw-border-none",
        invalid: "invalid:tw-ring-error-700 ",
        valid: "valid:tw-ring-success-700",
        focused: "focus:tw-ring-normal-800",
    };

    const [currentValue, setCurrentValue] = useState(value);

    return (
        <div className="inputContainer tw-text-neutral-900 tw-flex tw-flex-col tw-items-stretch tw-my-2 tw-font-Quicksand tw-text-lg tw-w-full tw-container tw-mx-auto">
            <label htmlFor={name} className="tw-m-2 tw-capitalize tw-font-semibold hover:tw-cursor-pointer tw-my-1">
                {label}
            </label>

            <input
                name={name}
                id={name}
                type={type}
                value={currentValue}
                minLength={minlength}
                placeholder={placeholder}
                autoFocus={isAutoFocus ? true : false}
                required={isRequired}
                autoComplete="off"
                onBlur={handleBlur}
                onChange={(evt) => {
                    setCurrentValue(evt.target.value);
                    return handleChange(evt);
                }}
                onKeyUp={handleKeyup}
                className={`${inputStateStyles.normal} ${inputStateStyles.invalid} ${inputStateStyles.focused} ${inputStateStyles.valid} tw-peer`}
            />

            {/* helper message */}
            {helperMsg && <InformationalMsg msg={helperMsg} utilityClasses="peer-invalid:tw-hidden" />}

            {/* error message */}
            {typeof inputErrMsg !== "undefined" && inputErrMsg.length > 0 && (
                <InformationalMsg
                    msg={inputErrMsg}
                    utilityClasses="peer-valid:tw-hidden peer-invalid:tw-visible tw-text-error-500"
                />
            )}
        </div>
    );
}

export default Input;
