/* eslint-disable react/no-unescaped-entities */
import React, { useRef, useState } from "react";
import Logo from "@components/logo";
import { Link, useNavigate } from "react-router-dom";
import Form, { FormPropTypes } from "@components/form";
import { useNotification } from "@context/notifications.context";
import capitalizeFirstChar from "@clientUtils/capitalizeFirstChar";

function Login() {
    const userData: Omit<User, "email"> = {
        username: "",
        password: "",
    };

    const credentials = useRef(userData);
    const navigate = useNavigate();
    const [err, setErr] = useState<Omit<User, "email">>({ username: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotification();

    function cancel(): void {
        //go back to previous page
        navigate(-1);
        return;
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

    async function handleSubmit(evt: React.FormEvent<HTMLFormElement>): Promise<void> {
        evt.preventDefault();
        setIsLoading(true);
        const el = evt.target as HTMLFormElement;
        let msg = "";
        const usernameEl = document.getElementById("username") as HTMLInputElement;
        const passwordEl = document.getElementById("password") as HTMLInputElement;

        for (let index = 0; index < el.elements.length; index++) {
            const node = el.elements[index] as HTMLInputElement | HTMLButtonElement;

            if (node.tagName.toLowerCase() === "input") {
                if (node.value.length === 0) {
                    msg = `${node.name.replace("_", " ")} is required`;
                    node.setCustomValidity(msg);
                    node.name.toLowerCase() === "username"
                        ? setErr({ ...err, username: msg })
                        : setErr({ ...err, password: msg });
                    break;
                }

                if (node.name.toLowerCase() === "username") {
                    credentials.current = { ...credentials.current, username: node.value };
                }

                if (node.name.toLowerCase() === "password") {
                    credentials.current = { ...credentials.current, password: node.value };
                }
            }
        }

        if (msg.length > 0) {
            setIsLoading(false);
            return;
        }

        const userLogin = await (
            await fetch("/api/user/login", {
                method: "post",
                body: JSON.stringify(credentials.current),
                headers: { "Content-Type": "application/json" },
            })
        ).json();

        const userLoginResponse: string = capitalizeFirstChar(userLogin.msg);

        setIsLoading(false);

        switch (userLoginResponse.toLowerCase()) {
            case "successful":
                return;
            case "username doesn't exist":
                usernameEl.setCustomValidity(userLoginResponse);
                setErr({ ...err, username: userLoginResponse });
                addNotification({ type: "error", msg: userLoginResponse });
                return;
            case "password not valid":
                passwordEl.setCustomValidity(userLoginResponse);
                setErr({ ...err, password: userLoginResponse });
                addNotification({ type: "error", msg: userLoginResponse });
                return;
            default:
                addNotification({ type: "error", msg: "Couldn't log you in.Please try again." });
                return;
        }
    }

    async function handleChange(evt: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        const el = evt.target as HTMLInputElement;

        if (el.value.length > 0) {
            el.setCustomValidity("");
        }

        return;
    }

    const loginForm: FormPropTypes = {
        inputFields: [
            {
                type: "text",
                label: "username",
                placeholder: "johnDoe",
                name: "username",
                value: credentials.current.username,
                isAutoFocus: true,
                inputErrMsg: err.username,
                handleChange: handleChange,
            },
            {
                type: "password",
                label: "password",
                placeholder: "password",
                name: "password",
                value: credentials.current.password,
                inputErrMsg: err.password,
                handleChange: handleChange,
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
            { typeOfButton: "submit", priority: "primary", value: "login", isLoading },
        ],
        alternativeOption: (
            <span className="tw-block tw-p-4 tw-pl-1 tw-font-Quicksand tw-font-medium">
                Don't have an account?
                <Link
                    to="/createAccount"
                    className="tw-font-bold tw-ml-1 tw-underline tw-uppercase hover:tw-underline-offset-2 focus:tw-underline-offset-2"
                >
                    create account
                </Link>
            </span>
        ),
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
                {/*logo*/}
                <div className="tw-flex tw-flex-col tw-w-full tw-relative tw-items-center tw-m-1 tw-ml-0 tw-justify-center">
                    <Logo height={"50"} width={"50"} header={true} />
                </div>

                <h1 className="tw-m-2 tw-my-5 tw-mb-1 tw-font-Quicksand tw-font-extrabold tw-text-xl tw-uppercase tw-w-fit tw-container tw-mx-auto">
                    login
                </h1>

                <Form
                    inputFields={loginForm.inputFields}
                    buttons={loginForm.buttons}
                    alternativeOption={loginForm.alternativeOption}
                    checkboxes={loginForm.checkboxes}
                    handleSubmit={handleSubmit}
                />
            </div>
        </>
    );
}

export default Login;
