import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNotification } from "@context/notifications.context";
import { useUser } from "@context/user.context";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@components/button";
import Input from "@components/inputField";
import TextArea from "@components/textArea";
import capitalizeFirstChar from "@clientUtils/capitalizeFirstChar";
import Image from "@components/image";
import CloseIcon from "@components/closeIcon";

interface CollectionInfo {
    collectionName: string;
    description: string;
    noOfItems: number;
}

interface EditCollectionModalProps extends Omit<CollectionInfo, "noOfItems"> {
    toggleModalStatus: () => void;
    setCollectionDetails: React.Dispatch<
        React.SetStateAction<{
            collectionName: string;
            description: string;
            noOfItems: number;
        }>
    >;
}

function EditCollectionModal({
    collectionName,
    description,
    toggleModalStatus,
    setCollectionDetails,
}: EditCollectionModalProps) {
    const { addNotification } = useNotification();

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
                <CloseIcon
                    backgroundColor={"tw-bg-neutral-50"}
                    shadowColor={"tw-shadow-neutral-50"}
                    fillColor={"tw-fill-neutral-800"}
                    strokeColor={"tw-stroke-neutral-800"}
                    position={"tw-absolute -tw-top-4 -tw-right-2"}
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

function PageBody({ collectionName, description, noOfItems }: CollectionInfo) {
    const [openModalStatus, setOpenModalStatus] = useState(false);
    const [skip, setSkip] = useState(0);
    const { currentUser, setUser } = useUser();
    const { addNotification } = useNotification();
    const redirect = useNavigate();
    const [collectionDetails, setCollectionDetails] = useState({ collectionName, description, noOfItems });

    const { data, isLoading, isFetching, isError, isSuccess } = useQuery("fetchCollectionImages", async () => {
        if (currentUser) {
            return await (
                await fetch(
                    `/api/collection/images/:${collectionName}?username=${currentUser.username}&&skip=${skip}&&limit=6`,
                    { method: "get" }
                )
            ).json();
        }
        throw "no user";
    });

    useEffect(() => {
        if (isSuccess && noOfItems > 6) {
            setSkip(skip + data.images.length);
        }

        if (isError) {
            addNotification({ type: "error", msg: "couldn't fetch user images" });
        }

        return;
    }, [isSuccess, isError]);

    function toggleModalStatus() {
        setOpenModalStatus(!openModalStatus);
        return;
    }

    function deleteCollection() {
        fetch(`/api/collection/:${name}`, { method: "delete" })
            .then((res) => res.json())
            .then((parsedRes) => {
                if (parsedRes.msg.toLowerCase() === "ok" && parsedRes.user) {
                    setUser(parsedRes.user);
                    addNotification({ type: "success", msg: "successful deleted." });
                    redirect("/profile");
                    return;
                } else if (parsedRes.msg.toLowerCase() === "ok") {
                    redirect("/profile");
                    return;
                } else {
                    throw "server error";
                }
            })
            .catch(() => {
                addNotification({ type: "error", msg: "error occurred deleting image" });
            });
        return;
    }

    return (
        <>
            {openModalStatus && (
                <EditCollectionModal
                    collectionName={collectionDetails.collectionName}
                    description={collectionDetails.description}
                    toggleModalStatus={toggleModalStatus}
                    setCollectionDetails={setCollectionDetails}
                />
            )}
            <div
                className="tw-font-Quicksand tw-flex tw-flex-col tw-w-full tw-items-center tw-mt-10"
                data-within="collectionDetails"
            >
                <span className="tw-block tw-font-bold tw-text-4xl">{capitalizeFirstChar(collectionName)}</span>
                {collectionDetails.description && (
                    <span className="tw-text-lg tw-text-center tw-font-medium">
                        {capitalizeFirstChar(collectionDetails.description)}
                    </span>
                )}
                {collectionDetails.noOfItems && (
                    <span className="tw-text-base tw-text-center tw-mb-4">{`contains ${collectionDetails.noOfItems} ${
                        collectionDetails.noOfItems > 1 ? "images" : "image"
                    }`}</span>
                )}
                <section>
                    <Button
                        priority={"secondary"}
                        value={"delete"}
                        extraStyles="tw-mr-4"
                        handleClick={deleteCollection}
                    />
                    <Button priority={"primary"} value={"edit"} handleClick={toggleModalStatus} />
                </section>
            </div>

            {isError && <h1>Error fetching images.</h1>}
            {isLoading && <h1>Loading</h1>}
            {isFetching && <h1>Please wait...</h1>}
            {isSuccess && <div className="tw-py-10 tw-mt-4">{data.images && <Image images={data.images} />}</div>}
        </>
    );
}

function EditCollection() {
    //const { addNotification } = useNotification();
    const location = useLocation();

    return (
        <div>
            {typeof location.state === "undefined" ||
            typeof (location.state as CollectionInfo).collectionName === "undefined" ||
            (location.state as CollectionInfo).collectionName.length <= 0 ? (
                <h1>{"Couldn't fetch collection"}</h1>
            ) : (
                <PageBody
                    collectionName={(location.state as CollectionInfo).collectionName}
                    description={(location.state as CollectionInfo).description}
                    noOfItems={(location.state as CollectionInfo).noOfItems}
                />
            )}
        </div>
    );
}

export default EditCollection;
