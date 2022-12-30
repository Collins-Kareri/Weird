import { useNotification } from "@context/notifications.context";
import capitalizeFirstChar from "@clientUtils/capitalizeFirstChar";
import React from "react";
import Button from "@components/button";
import TextArea from "@components/form/textArea";
import Input from "@components/form/inputField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CollectionInfo } from "@pages/profile/edit.Collection";

interface EditCollectionModalProps extends Omit<CollectionInfo, "noOfItems"> {
    toggleModalStatus: () => void;
    setCollectionDetails: React.Dispatch<React.SetStateAction<CollectionInfo>>;
}

function EditCollectionModal({
    collectionName,
    description,
    toggleModalStatus,
    setCollectionDetails,
}: EditCollectionModalProps) {
    const { addNotification } = useNotification();

    //updating collection details
    function update() {
        const descriptionEl = document.querySelector("#description") as HTMLTextAreaElement;
        const nameEl = document.querySelector("#collectionName") as HTMLInputElement;

        if (nameEl.value !== collectionName || descriptionEl.value !== description) {
            fetch(`/api/collection/:${collectionName}`, {
                method: "put",
                body: JSON.stringify({ description: descriptionEl.value, name: nameEl.value }),
                headers: { "Content-Type": "application/json" },
            })
                .then((res) => res.json())
                .then((parsedRes) => {
                    switch (parsedRes.msg.toLowerCase()) {
                        case "ok":
                            addNotification({ type: "success", msg: "succefully updated" });
                            toggleModalStatus();
                            setCollectionDetails({ ...parsedRes.collection });
                            return;
                        case "not updated":
                            addNotification({ type: "info", msg: "not updated" });
                            return;
                        default:
                            addNotification({ type: "error", msg: "Error occurred updating collection" });
                            return;
                    }
                })
                .catch(() => {
                    addNotification({ type: "error", msg: "Error occurred updating collection" });
                    return;
                });
        }

        return;
    }

    return (
        <div className="tw-absolute tw-w-full tw-h-full tw-z-30 tw-bg-neutral-700 tw-top-0 tw-bg-opacity-80 tw-flex tw-flex-col tw-items-center tw-justify-center">
            <div
                className="tw-relative tw-bg-neutral-50  tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-fit tw-p-4 tw-w-11/12 md:tw-w-2/4 md:tw-mx-auto tw-drop-shadow-xl tw-shadow-neutral-500 tw-rounded-md tw-my-4"
                data-within="editCollection"
            >
                <FontAwesomeIcon
                    icon={"xmark"}
                    size="2xl"
                    className="tw-absolute tw-right-4 tw-top-2 tw-cursor-pointer"
                    onClick={toggleModalStatus}
                />
                <Input
                    type={"text"}
                    label={"name"}
                    placeholder={"collection name"}
                    name={"collectionName"}
                    handleChange={() => {
                        return;
                    }}
                    value={capitalizeFirstChar(collectionName)}
                />
                <TextArea
                    label={"description"}
                    name={"description"}
                    placeHolder={"Collection description"}
                    value={description}
                />
                <section
                    className="tw-flex tw-flex-row tw-justify-between tw-w-full"
                    id="updateCollectionDataCtaContainer"
                >
                    <Button priority={"secondary"} value={"cancel"} handleClick={toggleModalStatus} />
                    <Button priority={"primary"} value={"update"} extraStyles="tw-mr-4" handleClick={update} />
                </section>
            </div>
        </div>
    );
}

export default EditCollectionModal;
