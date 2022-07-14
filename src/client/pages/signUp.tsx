import React, { useState, useReducer } from "react";
import InputField from "@client/components/inputField/inputField";
import Button from "@client/components/button/button";

type RequiredCredentials = {
    username: string;
    email: string;
    password: string;
};

type Action = {
    type: "username" | "email" | "password";
    payload: string;
};

type Step1Props = {
    setStep: React.Dispatch<React.SetStateAction<number>>;
    dispatch: React.Dispatch<Action>;
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

function Step1({ setStep, dispatch }: Step1Props): JSX.Element {
    function handleSubmit(evt: React.FormEvent<HTMLFormElement>): void {
        evt.preventDefault();
        return;
    }

    return (
        <form onSubmit={handleSubmit}>
            <InputField
                type="text"
                label="username"
                placeholder="johnDoe"
                name={"username"}
                isAutoFocus={true}
                isRequired={true}
            />
            <InputField type="email" label="email" placeholder="example@mail.com" name="email" isRequired={true} />
            <Button priority={"primary"} value={"next"} typeOfButton="submit" />
        </form>
    );
}

function SignUp() {
    const initialState: RequiredCredentials = {
        username: "",
        email: "",
        password: "",
    };
    const [step, setStep] = useState<number>(1);
    const [state, dispatch] = useReducer(reducer, initialState);
    return <>{step === 1 ? <Step1 setStep={setStep} dispatch={dispatch} /> : <></>}</>;
}

export default SignUp;
