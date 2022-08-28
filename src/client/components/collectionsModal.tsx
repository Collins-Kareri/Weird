import React from "react";
import CloseIcon from "@components/closeIcon";
import Input from "@components/inputField";
import TextArea from "@components/textArea";
import Button from "@components/button";

interface PropTypes {
    closeCollectionModal: () => void;
}

function CollectionsModal({ closeCollectionModal }: PropTypes) {
    return (
        <div className="tw-w-screen tw-h-screen tw-absolute tw-top-0 tw-left-0 tw-z-50 tw-bg-neutral-500 tw-bg-opacity-50 tw-flex tw-flex-col tw-items-center tw-justify-center">
            <div
                className=" tw-bg-neutral-50 tw-drop-shadow-xl tw-shadow-neutral-900 tw-p-4 tw-rounded-md tw-w-11/12 tw-font-Quicksand tw-py-5 md:tw-max-w-md lg:tw-max-w-lg"
                id="createCollection"
            >
                <CloseIcon
                    backgroundColor={"tw-bg-neutral-50"}
                    shadowColor={"tw-shadow-neutral-50"}
                    fillColor={"tw-fill-neutral-800"}
                    strokeColor={"tw-stroke-neutral-800"}
                    position={"tw-absolute -tw-top-4 -tw-right-2"}
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
                <TextArea name={"description"} label={"description"} />
                <Button
                    priority={"secondary"}
                    value={"cancel"}
                    extraStyles={"tw-mr-8"}
                    handleClick={closeCollectionModal}
                />
                <Button priority={"primary"} value={"create"} />
            </div>
        </div>
    );
}

export default CollectionsModal;
