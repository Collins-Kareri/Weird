/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useQuery } from "react-query";
import { useNotification } from "@context/notifications.context";
import { useUser } from "@context/user.context";
import capitalizeFirstChar from "@clientUtils/capitalizeFirstChar";
import generateKey from "@src/shared/utils/generateKeys";
import Button from "@components/button";
import AddIcon from "@src/client/components/iconsComponents/addIcon";
import { useNavigate, useLocation } from "react-router-dom";

interface CollectionContent {
    name: string;
    coverImage: string;
    key: string;
    noOfItems: number;
    description: string;
    refetch: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
    ) => Promise<QueryObserverResult<any, unknown>>;
}

function CollectionContent({ name, coverImage, noOfItems, key, description, refetch }: CollectionContent) {
    const { setUser } = useUser();
    const { addNotification } = useNotification();
    const redirect = useNavigate();
    const location = useLocation();

    function deleteCollection() {
        fetch(`/api/collection/:${name}`, { method: "delete" })
            .then((res) => res.json())
            .then((parsedRes) => {
                if (parsedRes.msg.toLowerCase() === "ok" && parsedRes.user) {
                    setUser(parsedRes.user);
                    addNotification({ type: "success", msg: "successful deleted." });
                    refetch();
                    return;
                } else if (parsedRes.msg.toLowerCase() === "ok") {
                    refetch();
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

    function editCollection() {
        redirect("edit/collection", {
            state: { from: location.pathname, collectionName: name, description, noOfItems },
        });
        return;
    }

    return (
        <div
            className="tw-inline-block tw-bg-neutral-100 tw-w-80 tw-mx-2 tw-h-fit tw-rounded-md tw-px-4 tw-py-4 tw-mb-10 tw-ring-1 tw-ring-neutral-300 tw-font-Quicksand main-transition"
            key={key}
            data-within="collection"
        >
            <Button priority={"secondary"} value={"edit"} handleClick={editCollection} />
            <Button priority={"tertiary"} value={"delete"} handleClick={deleteCollection} />

            {/**cover image or browse images button*/}
            <section className="tw-relative tw-bg-neutral-100 tw-my-4 tw-h-44 tw-rounded-md tw-shadow-inner tw-shadow-neutral-800 ">
                {noOfItems > 0 ? (
                    <img
                        src={coverImage}
                        alt="random image from fakerjs"
                        className="tw-relative tw-cursor-pointer tw-w-full tw-h-full tw-object-cover tw-rounded-md tw-shadow-inner tw-shadow-neutral-800"
                    />
                ) : (
                    <section className="tw-absolute tw-w-full tw-h-full tw-bg-neutral-400 tw-shadow-2xl tw-bg-opacity-70 tw-flex tw-flex-row tw-justify-center tw-items-center tw-rounded-md tw-z-30">
                        <AddIcon
                            backgroundColor={"tw-bg-neutral-300"}
                            shadowColor={"tw-shadow-neutral-300"}
                            fillColor={"tw-fill-neutral-700"}
                            strokeColor={"tw-stroke-neutral-700"}
                            position={""}
                            extraStyle={
                                "tw-ring-1 tw-ring-neutral-500 hover:tw-ring-offset-2 hover:tw-ring-offset-neutral-900 main-transition"
                            }
                            onClick={() => {
                                return;
                            }}
                        />
                    </section>
                )}
            </section>

            {/**collection name */}
            <p className="tw-cursor-pointer tw-font-semibold hover:tw-font-bold main-transition">
                {capitalizeFirstChar(name)}
            </p>

            {/**collection items number */}
            <p>{`${noOfItems} ${noOfItems >= 2 || noOfItems === 0 ? "items" : "item"}`}</p>
        </div>
    );
}

function Collections({ username, noOfCollections }: { username?: string; noOfCollections: number }) {
    const { isLoading, data, isError, refetch } = useQuery("collections", async () => {
        if (username) {
            return await (await fetch(`/api/collection/:${username}`, { method: "get" })).json();
        }

        return await (await fetch("/api/collection/", { method: "get" })).json();
    });

    const { addNotification } = useNotification();

    useEffect(() => {
        refetch();
        return;
    }, [noOfCollections]);

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    if (isError) {
        addNotification({ type: "error", msg: "Error occurred fetching collections." });
        return <></>;
    }

    return (
        <div className="tw-container tw-mx-auto tw-p-4 tw-grid tw-grid-flow-row tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-4 2xl:tw-grid-5 tw-place-content-center tw-place-items-center">
            {data &&
                data.collections &&
                (data.collections as CollectionContent[]).map(({ name, coverImage, noOfItems, description }) => {
                    return (
                        <CollectionContent
                            key={generateKey()}
                            coverImage={coverImage}
                            name={name}
                            noOfItems={noOfItems}
                            description={description}
                            refetch={refetch}
                        />
                    );
                })}
        </div>
    );
}

export default Collections;
