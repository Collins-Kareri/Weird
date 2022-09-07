/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Button from "@components/button";
import generateKey from "@src/shared/utils/generateKeys";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useQuery } from "react-query";
import { useNotification } from "@context/notifications.context";
import { CollectionInfo } from "@pages/profile/edit.Collection";
import { useLocation } from "react-router-dom";
import TagsInput from "@components/tagsInput";
import TextArea from "@components/textArea";
import CloseIcon from "@components/closeIcon";

interface ImageProps {
    images?: { url: string; public_id?: string }[];
    collectionName?: string;
    username?: string;
    refetch?: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
    ) => Promise<QueryObserverResult<any, unknown>>;
    setCollectionDetails?: React.Dispatch<React.SetStateAction<CollectionInfo>>;
}

interface EditCollectionImageBody extends Omit<ImageProps, "images" | "username"> {
    url: string;
    public_id?: string;
}

interface UserProfileImageBodyProps {
    url: string;
    public_id: string;
    toggleEditImageModal?: () => void;
}

function EditCollectionImageBody({
    url,
    public_id,
    collectionName,
    refetch,
    setCollectionDetails,
}: EditCollectionImageBody) {
    const { addNotification } = useNotification();

    function removeImageFromCollection() {
        fetch(`/api/collection/image/:${collectionName}`, {
            method: "delete",
            body: JSON.stringify({ public_id }),
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => {
                if (res.status >= 400) {
                    throw "couldn't remove image";
                }
                return res.json();
            })
            .then((parsedRes) => {
                if (parsedRes.msg.toLowerCase() === "ok") {
                    addNotification({ type: "info", msg: "Image removed." });
                    if (parsedRes.collection && setCollectionDetails) {
                        setCollectionDetails(parsedRes.collection as CollectionInfo);
                    }
                    if (refetch) {
                        refetch();
                    }
                } else {
                    addNotification({ type: "info", msg: parsedRes.msg as string });
                }
            })
            .catch(() => {
                addNotification({ type: "error", msg: "Could not remove image." });
            });
        return;
    }

    return (
        <section className="tw-inline-block tw-relative tw-w-full md:tw-w-80 xl:tw-w-96 tw-bg-neutral-500 tw-h-fit tw-rounded-md tw-mb-7">
            <div className="tw-absolute tw-p-2 tw-px-4 tw-z-10 tw-top-0 tw-bg-neutral-100 tw-w-full tw-bg-opacity-50 tw-bg-blend-soft-light">
                <Button priority={"tertiary"} value={"remove"} handleClick={removeImageFromCollection} />
            </div>
            <img
                src={url}
                alt="random image from fakerjs"
                className="tw-relative tw-cursor-pointer tw-w-full tw-object-cover tw-rounded-md tw-shadow-inner tw-shadow-neutral-800"
            />
        </section>
    );
}

function EditImageModal({ url, public_id, toggleEditImageModal }: UserProfileImageBodyProps) {
    const [tags, setTags] = useState<[] | string[]>([]);
    const { data, isError, error, isLoading, isSuccess } = useQuery(
        "fetchImageData",
        async () => {
            public_id;
            return (await fetch("url")).json();
        },
        { refetchInterval: false, retry: false }
    );
    const { addNotification } = useNotification();

    useEffect(() => {
        if (isSuccess && data && data.imageData && data.imageData.tags) {
            setTags(data.imageData.tags);
        }

        if (isError) {
            addNotification({ type: "error", msg: "Could not fetch image data." });
        }
    }, [error, isError, isSuccess]);

    return (
        <>
            <div className="tw-w-screen tw-h-screen tw-absolute tw-top-0 tw-left-0 tw-z-50 tw-bg-neutral-500 tw-bg-opacity-50 tw-flex tw-flex-col tw-items-center tw-justify-center">
                <div className=" tw-bg-neutral-50 tw-drop-shadow-xl tw-shadow-neutral-900 tw-p-4 tw-rounded-md tw-w-11/12 tw-font-Quicksand tw-py-5 md:tw-max-w-md lg:tw-max-w-lg">
                    <CloseIcon
                        backgroundColor={"tw-bg-neutral-50"}
                        shadowColor={"tw-shadow-neutral-50"}
                        fillColor={"tw-fill-neutral-800"}
                        strokeColor={"tw-stroke-neutral-800"}
                        position={"tw-absolute -tw-top-4 -tw-right-2"}
                        onClick={() => {
                            if (toggleEditImageModal) {
                                toggleEditImageModal();
                            }
                            return;
                        }}
                    />
                    <section className="tw-w-36 tw-h-36 tw-rounded-md tw-ring-1 tw-ring-neutral-800">
                        <img
                            src={url}
                            alt="random image from fakerjs"
                            className="tw-relative tw-w-full tw-h-full tw-object-cover tw-rounded-md tw-shadow-inner tw-shadow-neutral-800"
                        />
                    </section>

                    {isSuccess && <TagsInput tags={tags} setTags={setTags} />}
                    {isSuccess && (
                        <TextArea name={"description"} label={"description"} placeHolder={"image description"} />
                    )}
                    {isLoading && <h1>Please wait</h1>}
                    {isError && <h1>{"Could not fetch image data."}</h1>}

                    <Button
                        priority={"secondary"}
                        value={"cancel"}
                        extraStyles={"tw-mr-8"}
                        handleClick={() => {
                            if (toggleEditImageModal) {
                                toggleEditImageModal();
                            }
                            return;
                        }}
                    />
                    <Button priority={"primary"} value={"edit"} />
                </div>
            </div>
        </>
    );
}

function UserProfileImageBody({ url, public_id }: UserProfileImageBodyProps) {
    const [editImageModalStatus, setEditImageModalStatus] = useState(false);

    function toggleEditImageModal() {
        setEditImageModalStatus(!editImageModalStatus);
        return;
    }

    return (
        <>
            {editImageModalStatus && (
                <EditImageModal url={url} public_id={public_id} toggleEditImageModal={toggleEditImageModal} />
            )}
            <div className="tw-container tw-mx-auto tw-p-4 tw-mb-10 tw-columns-1 md:tw-columns-2 lg:tw-columns-3 2xl:tw-columns-4 tw-gap-x-4 tw-w-full">
                <section className="tw-inline-block tw-relative tw-w-full md:tw-w-80 xl:tw-w-96 tw-bg-neutral-500 tw-h-fit tw-rounded-md tw-mb-7">
                    <div className="tw-absolute tw-p-2 tw-px-4 tw-z-10 tw-top-0 tw-bg-neutral-100 tw-w-full tw-bg-opacity-50 tw-bg-blend-soft-light">
                        <Button
                            priority={"secondary"}
                            value={"edit"}
                            extraStyles={"tw-ring-neutral-900"}
                            handleClick={toggleEditImageModal}
                        />
                        <Button priority={"tertiary"} value={"delete"} />
                    </div>
                    <img
                        src={url}
                        alt="random image from fakerjs"
                        className="tw-relative tw-cursor-pointer tw-w-full tw-object-cover tw-rounded-md tw-shadow-inner tw-shadow-neutral-800"
                    />
                </section>
            </div>
        </>
    );
}

function Image({ images, collectionName, refetch, setCollectionDetails, username }: ImageProps) {
    const [skip, setSkip] = useState(0);
    const location = useLocation();

    const { data, isSuccess, isLoading } = useQuery(
        "fetchUserImages",
        async () => {
            if (username) {
                return await (await fetch(`/api/image/:${username}?skip=${skip}&&limit=6`, { method: "get" })).json();
            }
            return;
        },
        { refetchInterval: false }
    );

    useEffect(() => {
        if (username && isSuccess && data.Images && data.images.noOfImages && data.images.noOfImages > 6) {
            setSkip(skip + data.images.length);
        }
        return;
    }, [data]);

    return (
        <div
            className="tw-container tw-mx-auto tw-p-4 tw-mb-10 tw-columns-1 md:tw-columns-2 lg:tw-columns-3 2xl:tw-columns-4 tw-gap-x-4 tw-w-full"
            data-within="images"
        >
            {collectionName &&
                images &&
                images.map(({ url, public_id }) => {
                    return (
                        <EditCollectionImageBody
                            url={url}
                            public_id={public_id}
                            collectionName={collectionName}
                            refetch={refetch}
                            setCollectionDetails={setCollectionDetails}
                            key={generateKey()}
                        />
                    );
                })}
            {location.pathname === "/profile" &&
                isSuccess &&
                data.images &&
                (data.images as { url: string; public_id: string }[]).map(({ url, public_id }) => {
                    return <UserProfileImageBody url={url} public_id={public_id} key={generateKey()} />;
                })}
            {isLoading && <h1>Please wait...</h1>}
        </div>
    );
}

export default Image;
