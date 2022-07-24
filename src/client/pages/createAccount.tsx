import React, { useState, useRef } from "react";
import Form, { FormPropTypes } from "@components/form";

/**
 * the form to create a user it consists of two steps.
 * @returns JSX.Element
 */
function CreateAccount(): JSX.Element {
    const userData: User = {
        username: "",
        email: "",
        password: "",
    };

    const [step, setStep] = useState(1);
    const credentials = useRef(userData);
    const [err, setErr] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    // const [userCreateStatus,setUserCreateStatus] = useState(false);

    /**
     * check if the username or email exists in database. In the first step of the form
     * @param val
     * @returns boolean
     */
    async function checkIfCredentialExist(val: string): Promise<boolean> {
        const results = await (await fetch(`/api/user/:${val}`, { method: "get" })).json();
        if (results.msg === "found") {
            return true;
        }
        return false;
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
                        setErr("username exists");
                        break;
                    }
                    credentials.current = { ...credentials.current, username: node.value };
                }

                if (node.name === "email") {
                    if (await checkIfCredentialExist(node.value)) {
                        node.setCustomValidity("email exists");
                        setErr("email exists");
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

    function handleBack(evt: React.MouseEvent<HTMLButtonElement>): void {
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

    function togglePassword(allFormEl: HTMLFormControlsCollection, checked: boolean): void {
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

    function handlePasswordCheckBoxChange(evt: React.ChangeEvent<HTMLInputElement>): void {
        const el = evt.target;

        const parentForm = el.form as HTMLFormElement;

        const allFormEl = parentForm.elements;

        togglePassword(allFormEl, el.checked);

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
                validationChecks: checkIfCredentialExist,
                formErr: err,
            },
            {
                type: "email",
                label: "email",
                placeholder: "example@mail.com",
                name: "email",
                value: credentials.current.email,
                isRequired: true,
                validationChecks: checkIfCredentialExist,
                formErr: err,
            },
        ],
        buttons: [
            { typeOfButton: "button", priority: "secondary", value: "cancel", handleClick: cancel },
            { typeOfButton: "submit", priority: "primary", value: "next", isLoading },
        ],
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
            },
            {
                type: "password",
                label: "confirm password",
                placeholder: "confirm password",
                name: "confirm_password",
                value: credentials.current.password,
                minlength: 8,
                isRequired: true,
            },
        ],
        buttons: [
            { typeOfButton: "button", priority: "secondary", value: "back", handleClick: handleBack },
            { typeOfButton: "submit", priority: "primary", value: "create account", isLoading },
        ],
        checkboxes: [
            {
                value: "show password",
                name: "show_password",
                label: "show password",
                handleChange: handlePasswordCheckBoxChange,
            },
        ],
    };

    return (
        <>
            <h1 className="tw-p-3 tw-m-2 tw-font-Quicksand tw-font-extrabold tw-text-xl tw-uppercase">
                create account
            </h1>
            {step === 1 && (
                <Form inputFields={step1.inputFields} buttons={step1.buttons} handleSubmit={handleStep1Submit} />
            )}
            {step === 2 && (
                <Form
                    inputFields={step2.inputFields}
                    buttons={step2.buttons}
                    checkboxes={step2.checkboxes}
                    handleSubmit={handleStep2Submit}
                />
            )}
        </>
    );
}

export default CreateAccount;
