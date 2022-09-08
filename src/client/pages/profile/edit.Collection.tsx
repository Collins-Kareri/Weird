import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNotification } from "@context/notifications.context";
import { useUser } from "@context/user.context";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@components/button";
import capitalizeFirstChar from "@clientUtils/capitalizeFirstChar";
import Image from "@src/client/components/imageComponents/image";
import EditCollectionModal from "@components/modals/editCollection";

export interface CollectionInfo {
    collectionName: string;
    description: string;
    noOfItems: number;
}

function usePersistantState<T>(defaultValue: T, itemName: string) {
    const [value, setValue] = useState<T>(JSON.parse(localStorage.getItem(itemName) as string) || defaultValue);

    useEffect(() => {
        localStorage.setItem(itemName, JSON.stringify(value));
        return;
    }, [value]);

    return [value, setValue] as [T, React.Dispatch<React.SetStateAction<T>>];
}

function PageBody({
    collectionDetails,
    setCollectionDetails,
}: {
    collectionDetails: CollectionInfo;
    setCollectionDetails: React.Dispatch<React.SetStateAction<CollectionInfo>>;
}) {
    const [openModalStatus, setOpenModalStatus] = useState(false);
    const [skip, setSkip] = useState(0);
    const { currentUser, setUser } = useUser();
    const { addNotification } = useNotification();
    const redirect = useNavigate();

    const { data, isLoading, isFetching, isError, isSuccess, refetch } = useQuery(
        "fetchCollectionImages",
        async () => {
            if (currentUser) {
                return await (
                    await fetch(
                        `/api/collection/images/:${collectionDetails.collectionName}?username=${currentUser.username}&&skip=${skip}&&limit=6`,
                        { method: "get" }
                    )
                ).json();
            }
            throw "no user";
        },
        { refetchInterval: false }
    );

    useEffect(() => {
        if (isSuccess && collectionDetails.noOfItems > 6) {
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
        fetch(`/api/collection/:${collectionDetails.collectionName}`, { method: "delete" })
            .then((res) => res.json())
            .then((parsedRes) => {
                if (parsedRes.msg.toLowerCase() === "ok" && parsedRes.user) {
                    setUser(parsedRes.user);
                    addNotification({ type: "success", msg: "successful deleted." });
                    redirect("/profile");
                    return;
                } else if (parsedRes.msg.toLowerCase() === "ok") {
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
                <span className="tw-block tw-font-bold tw-text-4xl">
                    {capitalizeFirstChar(collectionDetails.collectionName)}
                </span>
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
            {isFetching && !isLoading && <h1>Please wait...</h1>}
            {isSuccess && (
                <div className="tw-py-10 tw-mt-4">
                    {data.images && (
                        <Image
                            images={data.images}
                            collectionName={collectionDetails.collectionName}
                            refetchCollectionImages={refetch}
                            setCollectionDetails={setCollectionDetails}
                        />
                    )}
                </div>
            )}
        </>
    );
}

function EditCollection() {
    //const { addNotification } = useNotification();
    const location = useLocation();
    const { collectionName, description, noOfItems } = location.state as CollectionInfo;
    const [collectionDetails, setCollectionDetails] = usePersistantState<CollectionInfo>(
        {
            collectionName,
            description,
            noOfItems,
        },
        "collectionInfo"
    );

    return (
        <div>
            {typeof location.state === "undefined" ||
            typeof (location.state as CollectionInfo).collectionName === "undefined" ||
            (location.state as CollectionInfo).collectionName.length <= 0 ? (
                <h1>{"Couldn't fetch collection"}</h1>
            ) : (
                <PageBody collectionDetails={collectionDetails} setCollectionDetails={setCollectionDetails} />
            )}
        </div>
    );
}

export default EditCollection;
