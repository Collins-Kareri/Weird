import React, { useState } from "react";
import capitalizeFirstChar from "@client/utils/capitalizeFirstChar";

type InputProps = Readonly<{
    type: string;
    label: string;
    placeholder: string;
    name: string;
    isAutoFocus?: boolean;
    isRequired?: boolean;
    helperMsg?: string;
}>;

type InputStateStyles = Readonly<{
    normal: string;
    invalid: string;
    valid: string;
    focused: string;
}>;

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

function Input({ type, label, placeholder, name, isRequired, isAutoFocus, helperMsg }: InputProps): JSX.Element {
    const [errMsg, setMsg] = useState("");
    const inputStateStyles: InputStateStyles = {
        normal: "tw-p-3 tw-bg-gray-300 tw-ring-1 tw-outline-none tw-rounded-lg tw-border-none",
        invalid: "invalid:tw-ring-red-600",
        valid: "valid:tw-ring-green-600",
        focused: "focus:tw-ring-blue-600",
    };

    function isValidEmail(el: HTMLInputElement): void {
        let msg: string | undefined;

        if (isRequired && el.value.length === 0) {
            msg = `${name} is required`;
            setMsg(`${name} is required`);
            el.setCustomValidity(msg);
            return;
        }

        if (type === "email" && el.value.length === 1) {
            msg = `${name} is not valid`;
            setMsg(msg);
            el.setCustomValidity(msg);
            return;
        }

        if (el.validity.typeMismatch) {
            setMsg("email is not valid");
            return;
        }

        el.setCustomValidity("");
        return;
    }

    function handleBlur(evt: React.FocusEvent<HTMLInputElement>): void {
        const el = evt.target as HTMLInputElement;
        let msg: string | undefined;

        if (isRequired && el.value.length === 0) {
            msg = `${name} is required`;
            setMsg(msg);
            el.setCustomValidity(msg);
            return;
        }

        if (type === "email") {
            isValidEmail(el);
        }

        return;
    }

    function handleTyping(evt: React.ChangeEvent<HTMLInputElement>): void {
        const el = evt.target;

        if (isRequired && el.value.length > 0) {
            el.setCustomValidity("");
        }

        if (type === "email") {
            isValidEmail(el);
        }

        return;
    }

    return (
        <div className="inputContainer tw-flex tw-flex-col tw-pl-3.5 tw-my-2 tw-font-Quicksand tw-text-lg tw-w-11/12">
            <label htmlFor={name} className="tw-m-2 tw-capitalize tw-font-semibold hover:tw-cursor-pointer ">
                {label}
            </label>
            <input
                name={name}
                id={name}
                type={type}
                placeholder={placeholder}
                autoFocus={isAutoFocus ? true : false}
                onBlur={handleBlur}
                onChange={handleTyping}
                className={`${inputStateStyles.normal} ${inputStateStyles.invalid} ${inputStateStyles.focused} ${inputStateStyles.valid} tw-peer`}
            />

            {/* helper message */}
            {helperMsg ? <InformationalMsg msg={helperMsg} utilityClasses="peer-invalid:tw-hidden" /> : <></>}

            {/* error message */}
            {errMsg.length > 0 ? (
                <InformationalMsg
                    msg={errMsg}
                    utilityClasses="peer-valid:tw-hidden peer-invalid:tw-visible tw-text-red-600"
                />
            ) : (
                <></>
            )}
        </div>
    );
}

export default Input;
