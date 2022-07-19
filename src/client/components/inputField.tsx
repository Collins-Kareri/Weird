import React, { useState } from "react";
import capitalizeFirstChar from "@clientUtils/capitalizeFirstChar";

type InputStateStyles = Readonly<{
    normal: string;
    invalid: string;
    valid: string;
    focused: string;
}>;

export type InputPropsTypes = Readonly<{
    type: string;
    label: string;
    placeholder: string;
    name: string;
    minlength?: number;
    value?: string;
    isAutoFocus?: boolean;
    isRequired?: boolean;
    helperMsg?: string;
    validationChecks?: (val: string) => Promise<boolean>;
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
    validationChecks,
}: InputPropsTypes): JSX.Element {
    const [errMsg, setErrMsg] = useState("");
    const [currentValue, setCurrentValue] = useState(value);
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
            setErrMsg(`${name} is required`);
            el.setCustomValidity(msg);
            return;
        }

        if (type === "email" && el.value.length === 1) {
            msg = `${name} is not valid`;
            setErrMsg(msg);
            el.setCustomValidity(msg);
            return;
        }

        if (el.validity.typeMismatch) {
            setErrMsg("email is not valid");
            return;
        }

        el.setCustomValidity("");
        return;
    }

    function passwordsMatch(compareVal: HTMLInputElement, confirmPassword: HTMLInputElement): void {
        let msg;
        if (compareVal && confirmPassword) {
            if (
                confirmPassword.value.length > 0 &&
                compareVal.value.toLowerCase() !== confirmPassword.value.toLowerCase()
            ) {
                msg = "passwords don't match";
                confirmPassword.setCustomValidity(msg);
                setErrMsg(msg);
            } else {
                confirmPassword.setCustomValidity("");
            }
        }
    }

    async function handleBlur(evt: React.FocusEvent<HTMLInputElement>): Promise<void> {
        const el = evt.target as HTMLInputElement;
        let msg: string | undefined;

        if (isRequired && el.value.length === 0) {
            msg = `${name} is required`;
            setErrMsg(msg);
            el.setCustomValidity(msg);
            return;
        }

        if (type === "email") {
            isValidEmail(el);
            if (typeof validationChecks === "function") {
                const alreadyExist = await validationChecks(el.value);
                if (alreadyExist) {
                    msg = "username already exists";
                    el.setCustomValidity(msg);
                    setErrMsg(msg);
                }
            }
            return;
        }

        if (name === "username" && typeof validationChecks === "function") {
            const alreadyExist = await validationChecks(el.value);
            if (alreadyExist) {
                msg = "username already exists";
                el.setCustomValidity(msg);
                setErrMsg(msg);
            }
            return;
        }

        if (type === "password" && name.toLowerCase() !== "confirm_password") {
            if (el.value.length < 8) {
                msg = "password should be atleast 8 characters long";
                setErrMsg(msg);
                el.setCustomValidity(msg);
            }
            return;
        }

        if (type === "password") {
            const compareVal = document.getElementById("password") as HTMLInputElement;
            const confirmPassword = document.getElementById("confirm_password") as HTMLInputElement;
            passwordsMatch(compareVal, confirmPassword);
            return;
        }

        return;
    }

    async function handleTyping(evt: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        const el = evt.target;
        setCurrentValue(el.value);
        if (isRequired && el.value.length > 0) {
            el.setCustomValidity("");
        }

        if (type === "email") {
            isValidEmail(el);
        }

        return;
    }

    function handleStopTyping(): void {
        if (type === "password") {
            const compareVal = document.getElementById("password") as HTMLInputElement;
            const confirmPassword = document.getElementById("confirm_password") as HTMLInputElement;
            setTimeout(() => {
                passwordsMatch(compareVal, confirmPassword);
            }, 500);
        }
        return;
    }

    return (
        <div className="inputContainer tw-flex tw-flex-col tw-pl-3.5 tw-my-2 tw-font-Quicksand tw-text-lg tw-w-11/12">
            <label htmlFor={name} className="tw-m-2 tw-capitalize tw-font-medium hover:tw-cursor-pointer ">
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
                onBlur={handleBlur}
                onChange={handleTyping}
                onKeyUp={handleStopTyping}
                className={`${inputStateStyles.normal} ${inputStateStyles.invalid} ${inputStateStyles.focused} ${inputStateStyles.valid} tw-peer`}
            />

            {/* helper message */}
            {helperMsg && <InformationalMsg msg={helperMsg} utilityClasses="peer-invalid:tw-hidden" />}

            {/* error message */}
            {errMsg.length > 0 && (
                <InformationalMsg
                    msg={errMsg}
                    utilityClasses="peer-valid:tw-hidden peer-invalid:tw-visible tw-text-red-600"
                />
            )}
        </div>
    );
}

export default Input;
