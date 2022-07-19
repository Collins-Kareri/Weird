import React, { useState, useReducer, useEffect } from "react";
import Form, { FormPropTypes } from "@components/form";

type Action = {
    type: string;
    payload: string;
};

function reducer(currentState: User, action: Action) {
    switch (action.type) {
        case "username":
            return { ...currentState, username: action.payload };
        case "email":
            return { ...currentState, email: action.payload };
        case "password":
            return { ...currentState, password: action.payload };
        default:
            return currentState;
    }
}

async function createUser(credentials: User) {
    const userCreate = await (
        await fetch("/api/user/create", {
            method: "post",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
        })
    ).json();

    if (userCreate.msg.toLowerCase() === "account was successfully created") {
        //display success msg
        //move to profile page
        //store user credentials available to global app front-end state. Persist user.
    }
}

/**
 * the form to create a user it consists of two steps.
 * @returns JSX.Element
 */
function CreateAccount(): JSX.Element {
    const initialState: User = {
        username: "",
        email: "",
        password: "",
    };

    const [step, setStep] = useState<number>(1);

    const [currentCredentials, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        createUser(currentCredentials);
    }, [currentCredentials.password]);

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

    function handleStep1Submit(evt: React.FormEvent<HTMLFormElement>): void {
        evt.preventDefault();
        const el = evt.target as HTMLFormElement;
        for (let index = 0; index < el.elements.length; index++) {
            const node = el.elements[index] as HTMLInputElement | HTMLButtonElement;

            if (node.tagName.toLowerCase() === "input" && (node.type === "email" || node.type === "text")) {
                dispatch({ type: node.name, payload: node.value });
            }
        }
        setStep(2);
        return;
    }

    function handleBack(evt: React.MouseEvent<HTMLButtonElement>): void {
        evt.preventDefault();
        setStep(1);
        return;
    }

    async function handleStep2Submit(evt: React.FormEvent<HTMLFormElement>): Promise<void> {
        evt.preventDefault();
        const el = evt.target as HTMLFormElement;
        for (let index = 0; index < el.elements.length; index++) {
            const node = el.elements[index] as HTMLInputElement | HTMLButtonElement;
            if (node.tagName.toLowerCase() === "input") {
                if (node.name.toLowerCase() === "password") {
                    dispatch({ type: "password", payload: node.value });
                }
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
                value: currentCredentials.username,
                isAutoFocus: true,
                isRequired: true,
                validationChecks: checkIfCredentialExist,
            },
            {
                type: "email",
                label: "email",
                placeholder: "example@mail.com",
                name: "email",
                value: currentCredentials.email,
                isRequired: true,
                validationChecks: checkIfCredentialExist,
            },
        ],
        buttons: [{ typeOfButton: "submit", priority: "primary", value: "next" }],
    };

    const step2: FormPropTypes = {
        inputFields: [
            {
                type: "password",
                label: "password",
                placeholder: "password",
                name: "password",
                value: currentCredentials.password,
                minlength: 8,
                isRequired: true,
                helperMsg: "min-length 8 characters",
            },
            {
                type: "password",
                label: "confirm password",
                placeholder: "confirm password",
                name: "confirm_password",
                value: currentCredentials.password,
                minlength: 8,
                isRequired: true,
            },
        ],
        buttons: [
            { typeOfButton: "button", priority: "secondary", value: "back", handleClick: handleBack },
            { typeOfButton: "submit", priority: "primary", value: "create account" },
        ],
    };

    return (
        <>
            <h1 className="tw-p-3 tw-m-2 tw-font-Quicksand tw-font-extrabold tw-text-xl tw-uppercase">
                create account
            </h1>
            {step === 1 ? (
                <Form inputFields={step1.inputFields} buttons={step1.buttons} handleSubmit={handleStep1Submit} />
            ) : (
                <></>
            )}
            {step === 2 ? (
                <Form inputFields={step2.inputFields} buttons={step2.buttons} handleSubmit={handleStep2Submit} />
            ) : (
                <></>
            )}
        </>
    );
}

export default CreateAccount;
