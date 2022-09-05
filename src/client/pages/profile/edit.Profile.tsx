import React, { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, AuthenticatedUserSafeProps } from "@context/user.context";
import { useNotification } from "@context/notifications.context";
import Input from "@components/inputField";
import Button from "@components/button";
import ProfilePic from "@pages/profile/profilePic";
import { isValidEmail, isValidUsername, checkIfCredentialExist } from "@pages/createAccount/createAccount.validators";
import { ErrorTypes, reducer } from "@pages/createAccount/createAccount";

function EditProfile() {
    //todo make sure the new username is valid as well as the email
    const errTypes: ErrorTypes = {
        username: "",
        email: "",
        password: "",
        confirm_password: "",
    };

    const { currentUser, setUser } = useUser();
    const { addNotification } = useNotification();
    const redirect = useNavigate();
    const [err, dispatch] = useReducer(reducer, errTypes);

    async function handleBlur(evt: React.FocusEvent<HTMLInputElement>): Promise<void> {
        const el = evt.target as HTMLInputElement;
        let msg: string | undefined;

        if (el.value.length === 0) {
            if (el.name === "email") {
                el.value = (currentUser as AuthenticatedUserSafeProps)[el.name];
            }

            if (el.name === "username") {
                el.value = (currentUser as AuthenticatedUserSafeProps)[el.name];
            }

            return;
        }

        if (
            el.type === "email" &&
            el.name === "email" &&
            el.value !== (currentUser as AuthenticatedUserSafeProps)[el.name]
        ) {
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

        if (
            el.name === "username" &&
            el.name === "username" &&
            el.value !== (currentUser as AuthenticatedUserSafeProps)[el.name]
        ) {
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
    }

    function updateUserData() {
        const userEl = document.querySelector("#username") as HTMLInputElement;
        const emailEl = document.querySelector("#email") as HTMLInputElement;

        /**
         * update user
         * @param userData
         */
        function _updateHandler(userData: { username?: string; email?: string }) {
            fetch("/api/user/update", {
                method: "put",
                body: JSON.stringify(userData),
                headers: { "Content-Type": "application/json" },
            })
                .then((serverRes) => {
                    if (serverRes.status >= 400) {
                        throw "couldn't update user";
                    }

                    return serverRes.json();
                })
                .then((parsedRes) => {
                    setUser(parsedRes.user);
                    addNotification({ type: "success", msg: "successfully updated" });
                    return;
                })
                .catch((err) => {
                    addNotification({ type: "error", msg: err });
                });
        }

        if (userEl.value.length <= 0 || emailEl.value.length <= 0) {
            return;
        }

        if (userEl.value !== currentUser?.username && emailEl.value !== currentUser?.email) {
            _updateHandler({ username: userEl.value, email: emailEl.value });
            return;
        }

        if (userEl.value !== currentUser?.username) {
            _updateHandler({ username: userEl.value });
            return;
        }

        if (emailEl.value !== currentUser?.email) {
            _updateHandler({ email: emailEl.value });
            return;
        }

        return;
    }

    return (
        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-screen tw-p-4 tw-w-full md:tw-w-2/4 md:tw-mx-auto">
            <h1 className="tw-font-Quicksand tw-font-extrabold tw-mb-7">EDIT PROFILE</h1>
            <ProfilePic />

            <Input
                type={"text"}
                label={"username"}
                placeholder={"username"}
                name={"username"}
                handleChange={() => {
                    return;
                }}
                value={currentUser?.username}
                isAutoFocus={true}
                inputErrMsg={err.username}
                handleBlur={handleBlur}
            />
            <Input
                type={"email"}
                label={"email"}
                placeholder={"email"}
                name={"email"}
                handleChange={() => {
                    return;
                }}
                value={currentUser?.email}
                isAutoFocus={false}
                inputErrMsg={err.username}
                handleBlur={handleBlur}
            />
            <section className="tw-flex tw-flex-row tw-justify-between tw-w-full" id="updateUserDataCtaContainer">
                <Button
                    priority="secondary"
                    value="cancel"
                    handleClick={() => {
                        redirect("/profile");
                        return;
                    }}
                    extraStyles={"tw-mr-4"}
                />
                <Button priority="primary" value="update" handleClick={updateUserData} />
            </section>
        </div>
    );
}

export default EditProfile;
