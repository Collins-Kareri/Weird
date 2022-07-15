import React, { useState, useReducer } from "react";
import Form, { FormPropTypes } from "@client/components/form";

type RequiredCredentials = {
    username: string;
    email: string;
    password: string;
};

type Action = {
    type: string;
    payload: string;
};

function reducer(currentState: RequiredCredentials, action: Action) {
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

function CreateAccount() {
    const initialState: RequiredCredentials = {
        username: "",
        email: "",
        password: "",
    };

    const [step, setStep] = useState<number>(1);

    const [state, dispatch] = useReducer(reducer, initialState);

    const step1: FormPropTypes = {
        inputFields: [
            {
                type: "text",
                label: "username",
                placeholder: "johnDoe",
                name: "username",
                value: state.username,
                isAutoFocus: true,
                isRequired: true,
                validationChecks: checkIfExist,
            },
            {
                type: "email",
                label: "email",
                placeholder: "example@mail.com",
                name: "email",
                value: state.email,
                isRequired: true,
                validationChecks: checkIfExist,
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
                value: state.password,
                minlength: 8,
                isAutoFocus: true,
                isRequired: true,
                helperMsg: "min-length 8 characters",
            },
            {
                type: "password",
                label: "confirm password",
                placeholder: "confirm password",
                name: "confirm password",
                value: state.password,
                minlength: 8,
                isRequired: true,
            },
        ],
        buttons: [
            { typeOfButton: "button", priority: "secondary", value: "back", handleClick: handleBack },
            { typeOfButton: "submit", priority: "primary", value: "create account" },
        ],
    };

    function handleStep1Submit(evt: React.FormEvent<HTMLFormElement>): void {
        evt.preventDefault();
        const el = evt.target as HTMLFormElement;
        for (let index = 0; index < el.elements.length; index++) {
            const node = el.elements[index] as HTMLInputElement | HTMLButtonElement;

            if (
                (node.tagName.toLowerCase() === "input" && node.type === "password") ||
                node.type === "email" ||
                node.type === "text"
            ) {
                dispatch({ type: node.name, payload: node.value });
            }
        }
        setStep(2);
        return;
    }

    function handleStep2Submit(evt: React.FormEvent<HTMLFormElement>): void {
        evt.preventDefault();
        const el = evt.target as HTMLFormElement;
        for (let index = 0; index < el.elements.length; index++) {
            const node = el.elements[index] as HTMLInputElement | HTMLButtonElement;
            if (node.nodeName.toLowerCase() === "input") {
                if (node.name.toLowerCase() === "password") {
                    dispatch({ type: node.name, payload: node.value });
                }
            }
        }
        return;
    }

    function handleBack(evt: React.MouseEvent<HTMLButtonElement>): void {
        evt.preventDefault();
        console.log(evt);
        setStep(1);
        return;
    }

    /**
     * check if the value passed exists in database
     * @param val
     * @returns boolean
     */
    async function checkIfExist(val: string): Promise<boolean> {
        const results = await (await fetch(`/api/findUser:${val}`, { method: "get" })).json();
        if (results.msg === "found") {
            return true;
        }
        return false;
    }

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
