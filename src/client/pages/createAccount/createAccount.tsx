import React, { useState, useReducer, useRef } from "react";
import Form, { FormPropTypes } from "@components/form";
import Logo from "@assets/logo.svg";
import {
    passwordsMatch,
    isValidEmail,
    isValidUsername,
    checkIfCredentialExist,
} from "@pages/createAccount/createAccount.validators";

interface ErrorTypes {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
}

interface ErrorDispatchActions {
    type: string;
    payload?: string;
}

function reducer(currentState: ErrorTypes, action: ErrorDispatchActions) {
    if (typeof action.payload === "undefined") {
        action.payload = "";
    }

    const { type, payload } = action;

    switch (type) {
        case "username":
            return { ...currentState, username: payload };
        case "email":
            return { ...currentState, email: payload };
        case "password":
            return { ...currentState, password: payload };
        case "confirm_password":
            return { ...currentState, confirm_password: payload };
        default:
            return currentState;
    }
}

/**
 * Form to create a user it consists of two steps.
 * @returns JSX.Element
 */
function CreateAccount(): JSX.Element {
    const userData: User = {
        username: "",
        email: "",
        password: "",
    };

    const errTypes: ErrorTypes = {
        username: "",
        email: "",
        password: "",
        confirm_password: "",
    };

    const credentials = useRef(userData);
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [err, dispatch] = useReducer(reducer, errTypes);

    async function handleBlur(evt: React.FocusEvent<HTMLInputElement>): Promise<void> {
        const el = evt.target as HTMLInputElement;
        let msg: string | undefined;

        if (el.required && el.value.length === 0) {
            msg = `${el.name} is required`;
            dispatch({ type: el.name, payload: msg });
            el.setCustomValidity(msg);
            return;
        }

        if (el.type === "email") {
            isValidEmail(el, dispatch);

            if (el.validity.valid && typeof checkIfCredentialExist === "function") {
                const alreadyExist = await checkIfCredentialExist(el.value);
                if (alreadyExist) {
                    msg = "email exists";
                    el.setCustomValidity(msg);
                    dispatch({ type: "email", payload: msg });
                }
            }
            return;
        }

        if (el.name === "username") {
            isValidUsername(el, dispatch);

            if (el.validity.valid && typeof checkIfCredentialExist === "function") {
                const alreadyExist = await checkIfCredentialExist(el.value);
                if (alreadyExist) {
                    msg = "username exists";
                    el.setCustomValidity(msg);
                    dispatch({ type: "username", payload: msg });
                }
            }

            return;
        }

        if (el.type === "password" && el.name.toLowerCase() !== "confirm_password") {
            if (el.value.length < 8) {
                msg = "password should be atleast 8 characters long";
                dispatch({ type: "password", payload: msg });
                el.setCustomValidity(msg);
            }
            return;
        }

        if (el.type === "password") {
            const compareVal = document.getElementById("password") as HTMLInputElement;
            const confirmPassword = document.getElementById("confirm_password") as HTMLInputElement;
            if (confirmPassword) {
                passwordsMatch(compareVal, confirmPassword, dispatch);
            }
            return;
        }

        return;
    }

    function handleKeyup(evt: React.KeyboardEvent<HTMLInputElement>): void {
        const el = evt.target as HTMLInputElement;
        if (el.type === "password") {
            const compareVal = document.getElementById("password") as HTMLInputElement;
            const confirmPassword = document.getElementById("confirm_password") as HTMLInputElement;
            if (confirmPassword) {
                setTimeout(() => {
                    passwordsMatch(compareVal, confirmPassword, dispatch);
                }, 700);
            }
        }
        return;
    }

    async function handleChange(evt: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        const el = evt.target as HTMLInputElement;

        if (el.required && el.value.length > 0) {
            el.setCustomValidity("");
        }

        if (el.type === "email") {
            isValidEmail(el, dispatch);
        }

        return;
    }

    async function handleStep1Submit(evt: React.FormEvent<HTMLFormElement>): Promise<void> {
        evt.preventDefault();
        setIsLoading(true);

        const el = evt.target as HTMLFormElement;
        for (let index = 0; index < el.elements.length; index++) {
            const node = el.elements[index] as HTMLInputElement | HTMLButtonElement;

            if (node.tagName.toLowerCase() === "input" && (node.type === "email" || node.name === "username")) {
                if (node.name === "username") {
                    if (await checkIfCredentialExist(node.value)) {
                        node.setCustomValidity("username exists");
                        dispatch({ type: "username", payload: "username exists" });
                        break;
                    }
                    credentials.current = { ...credentials.current, username: node.value };
                }

                if (node.name === "email") {
                    if (await checkIfCredentialExist(node.value)) {
                        node.setCustomValidity("email exists");
                        dispatch({ type: "email", payload: "email exists" });
                        break;
                    }
                    credentials.current = { ...credentials.current, email: node.value };
                }
            }
        }

        setIsLoading(false);
        setStep(2);
        return;
    }

    function cancel(evt: React.MouseEvent<HTMLButtonElement>): void {
        evt.preventDefault();
        //go back to previous page
        //navigate(-1)
        return;
    }

    function back(evt: React.MouseEvent<HTMLButtonElement>): void {
        evt.preventDefault();
        setStep(1);
        return;
    }

    async function handleStep2Submit(evt: React.FormEvent<HTMLFormElement>): Promise<void> {
        evt.preventDefault();
        setIsLoading(true);

        const el = evt.target as HTMLFormElement;
        for (let index = 0; index < el.elements.length; index++) {
            const node = el.elements[index] as HTMLInputElement | HTMLButtonElement;
            if (node.tagName.toLowerCase() === "input") {
                if (node.name.toLowerCase() === "password") {
                    credentials.current = { ...credentials.current, password: node.value };
                }
            }
        }

        const userCreate = await (
            await fetch("/api/user/create", {
                method: "post",
                body: JSON.stringify(credentials.current),
                headers: { "Content-Type": "application/json" },
            })
        ).json();

        const userCreateResponse: string = userCreate.msg;

        setIsLoading(false);

        switch (userCreateResponse.toLowerCase()) {
            case "account created successfully":
                return;
            default:
                return;
        }
    }

    function togglePassword(evt: React.ChangeEvent<HTMLInputElement>): void {
        const el = evt.target;
        const checked = el.checked;

        const parentForm = el.form as HTMLFormElement;

        const allFormEl = parentForm.elements;

        for (let index = 0; index < allFormEl?.length; index++) {
            const currentEl = allFormEl[index] as HTMLInputElement | HTMLButtonElement;

            if (currentEl.type === "password" && currentEl.name.includes("password") && checked) {
                currentEl.type = "text";
            }

            if (currentEl.type === "text" && currentEl.name.includes("password") && !checked) {
                currentEl.type = "password";
            }
        }

        return;
    }

    const step1: FormPropTypes = {
        inputFields: [
            {
                type: "text",
                label: "username",
                placeholder: "johnDoe",
                name: "username",
                value: credentials.current.username,
                isAutoFocus: true,
                isRequired: true,
                inputErrMsg: err.username,
                handleBlur,
                handleKeyup,
                handleChange,
            },
            {
                type: "email",
                label: "email",
                placeholder: "example@mail.com",
                name: "email",
                value: credentials.current.email,
                isRequired: true,
                inputErrMsg: err.email,
                handleBlur,
                handleKeyup,
                handleChange,
            },
        ],
        buttons: [
            {
                typeOfButton: "button",
                priority: "secondary",
                value: "cancel",
                extraStyles: "tw-mr-3.5",
                handleClick: cancel,
            },
            { typeOfButton: "submit", priority: "primary", value: "next", isLoading },
        ],
        alternativeOption: (
            <span className="tw-block tw-p-4 tw-pl-1 tw-font-Quicksand tw-font-medium">
                Already have an account?{" "}
                <a href="#" className="tw-font-bold tw-underline tw-uppercase">
                    log in
                </a>
            </span>
        ),
    };

    const step2: FormPropTypes = {
        inputFields: [
            {
                type: "password",
                label: "password",
                placeholder: "password",
                name: "password",
                value: credentials.current.password,
                minlength: 8,
                isRequired: true,
                helperMsg: "min-length 8 characters",
                inputErrMsg: err.password,
                handleBlur,
                handleKeyup,
                handleChange,
            },
            {
                type: "password",
                label: "confirm password",
                placeholder: "confirm password",
                name: "confirm_password",
                value: credentials.current.password,
                minlength: 8,
                isRequired: true,
                inputErrMsg: err.confirm_password,
                handleBlur,
                handleKeyup,
                handleChange,
            },
        ],
        buttons: [
            {
                typeOfButton: "button",
                priority: "secondary",
                value: "back",
                extraStyles: "tw-mr-3.5",
                handleClick: back,
            },
            { typeOfButton: "submit", priority: "primary", value: "create account", isLoading },
        ],
        checkboxes: [
            {
                value: "show password",
                name: "show_password",
                label: "show password",
                handleChange: togglePassword,
            },
        ],
    };

    return (
        <>
            <div className="tw-flex tw-h-screen tw-w-11/12 md:tw-w-2/3 lg:tw-max-w-lg tw-flex-col tw-items-stretch tw-justify-center tw-container tw-mx-auto">
                <div className="tw-flex tw-w-full tw-relative tw-items-center tw-m-1 tw-ml-0 tw-justify-center">
                    <a href="/">
                        <img
                            className="tw-mr-2 tw-inline-block tw-cursor-pointer"
                            src={Logo}
                            height="50"
                            width="50"
                            alt="Weird"
                        />
                    </a>
                    <p className="tw-font-Arvo tw-text-lg tw-uppercase tw-inline-block">weird</p>
                </div>

                <div>
                    <h1 className="tw-m-2 tw-my-5 tw-font-Quicksand tw-font-extrabold tw-text-xl tw-uppercase tw-w-fit tw-container tw-mx-auto">
                        create account
                    </h1>

                    {step === 1 && (
                        <Form
                            inputFields={step1.inputFields}
                            buttons={step1.buttons}
                            alternativeOption={step1.alternativeOption}
                            handleSubmit={handleStep1Submit}
                        />
                    )}

                    {step === 2 && (
                        <Form
                            inputFields={step2.inputFields}
                            buttons={step2.buttons}
                            checkboxes={step2.checkboxes}
                            handleSubmit={handleStep2Submit}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

export default CreateAccount;
