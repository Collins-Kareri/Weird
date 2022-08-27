import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@context/user.context";
import { useNotification } from "@context/notifications.context";
import Input from "@components/inputField";
import Button from "@components/button";
import ChangeProfilePic from "@pages/profile/changeProfilePic";

function EditProfile() {
    const { currentUser, setUser } = useUser();
    const { addNotification } = useNotification();
    const redirect = useNavigate();

    function updateUserData() {
        const userEl = document.querySelector("#username") as HTMLInputElement;
        const emailEl = document.querySelector("#email") as HTMLInputElement;

        function _update(userData: { username?: string; email?: string }) {
            fetch("/api/user/update", { method: "put", body: JSON.stringify(userData) })
                .then((serverRes) => {
                    if (serverRes.status >= 400) {
                        throw "coudln't update user";
                    }

                    return serverRes.json();
                })
                .then((parsedRes) => {
                    setUser(parsedRes.user);
                    addNotification({ type: "success", msg: "successfully updated" });
                })
                .catch((err) => {
                    addNotification({ type: "error", msg: err });
                });
        }

        if (userEl.value.length <= 0 || emailEl.value.length <= 0) {
            return;
        }

        if (userEl.value !== currentUser?.username && emailEl.value !== currentUser?.email) {
            _update({ username: userEl.value, email: emailEl.value });
            return;
        }

        if (userEl.value !== currentUser?.username) {
            _update({ username: userEl.value });
            return;
        }

        if (emailEl.value !== currentUser?.email) {
            _update({ email: emailEl.value });
            return;
        }

        return;
    }

    return (
        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-screen tw-p-4 tw-w-11/12">
            <ChangeProfilePic />
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
            />
            <Input
                type={"text"}
                label={"email"}
                placeholder={"email"}
                name={"email"}
                handleChange={() => {
                    return;
                }}
                value={currentUser?.email}
                isAutoFocus={true}
            />
            <section className="tw-flex tw-flex-row tw-items-start tw-w-full">
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
