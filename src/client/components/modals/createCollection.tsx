import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "@components/form/inputField";
import TextArea from "@components/form/textArea";
import Button from "@components/button";
import { useUser } from "@context/user.context";
import { useNotification } from "@context/notifications.context";

interface PropTypes {
    closeCollectionModal: () => void;
}

function CollectionsModal({ closeCollectionModal }: PropTypes) {
    const { currentUser, setUser } = useUser();
    const { addNotification } = useNotification();

    function createCollection() {
        const collectionName = (document.querySelector("#collection") as HTMLInputElement).value;
        const description = (document.querySelector("#description") as HTMLTextAreaElement).value;

        if (currentUser) {
            fetch("api/collection/", {
                method: "post",
                body: JSON.stringify({ collectionName, description }),
                headers: { "Content-Type": "application/json" },
            })
                .then((res) => res.json())
                .then((parsedRes) => {
                    switch (parsedRes.msg.toLowerCase()) {
                        case "ok":
                            closeCollectionModal();
                            setUser(parsedRes.user);
                            addNotification({ type: "success", msg: "Created collection." });
                            return;
                        case "not created":
                            addNotification({ type: "warning", msg: "Collection not created" });
                            return;
                        default:
                            addNotification({
                                type: "error",
                                msg: "Collection couldn't be created. Please try again.",
                            });
                            return;
                    }
                })
                .catch(() => {
                    addNotification({
                        type: "error",
                        msg: "Error occurred creating collection.",
                    });
                    return;
                });
            return;
        }

        addNotification({ type: "info", msg: "Login to create a collection." });
        return;
    }

    return (
        <div className="tw-w-screen tw-h-screen tw-absolute tw-top-0 tw-left-0 tw-z-50 tw-bg-neutral-500 tw-bg-opacity-50 tw-flex tw-flex-col tw-items-center tw-justify-center">
            <div
                className=" tw-bg-neutral-50 tw-drop-shadow-xl tw-shadow-neutral-900 tw-p-4 tw-rounded-md tw-w-11/12 tw-font-Quicksand tw-py-5 md:tw-max-w-md lg:tw-max-w-lg"
                id="createCollection"
            >
                <FontAwesomeIcon
                    icon={"xmark"}
                    size="2xl"
                    className="tw-absolute tw-right-4 tw-top-2 tw-cursor-pointer"
                    onClick={closeCollectionModal}
                />
                <Input
                    type={"text"}
                    label={"collection name"}
                    placeholder={"collection name"}
                    name={"collection"}
                    handleChange={() => {
                        return;
                    }}
                />
                <TextArea name={"description"} label={"description"} placeHolder={"Collection description"} />
                <div className="tw-mt-4">
                    <Button
                        priority={"secondary"}
                        value={"cancel"}
                        extraStyles={"tw-mr-8"}
                        handleClick={closeCollectionModal}
                    />
                    <Button
                        priority={"primary"}
                        value={"create"}
                        handleClick={createCollection}
                        typeOfButton={"submit"}
                    />
                </div>
            </div>
        </div>
    );
}

export default CollectionsModal;
