/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Button from "@components/button";
import generateKey from "@src/shared/utils/generateKeys";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from "react-query/types/core";
import { useNotification } from "@context/notifications.context";

interface ImageProps {
    images: { url: string; public_id?: string }[];
    collectionName?: string;
    refetch?: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
    ) => Promise<QueryObserverResult<any, unknown>>;
}

interface ImageBodyProps extends Omit<ImageProps, "images"> {
    url: string;
    public_id?: string;
}

function ImageBody({ url, public_id, collectionName, refetch }: ImageBodyProps) {
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

function Image({ images, collectionName, refetch }: ImageProps) {
    return (
        <div
            className="tw-container tw-mx-auto tw-p-4 tw-mb-10 tw-columns-1 md:tw-columns-2 lg:tw-columns-3 2xl:tw-columns-4 tw-gap-x-4 tw-w-full"
            data-within="images"
        >
            {images.map(({ url, public_id }) => {
                return (
                    <ImageBody
                        url={url}
                        public_id={public_id}
                        collectionName={collectionName}
                        refetch={refetch}
                        key={generateKey()}
                    />
                );
            })}
        </div>
    );
}

export default Image;
