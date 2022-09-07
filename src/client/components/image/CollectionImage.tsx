import { useNotification } from "@context/notifications.context";
import { CollectionInfo } from "@pages/profile/edit.Collection";
import React from "react";
import Button from "@components/button";
import { ImageProps } from "@components/image/image";

interface EditCollectionImageBody extends Omit<ImageProps, "images" | "username"> {
    url: string;
    public_id?: string;
}

function CollectionImage({
    url,
    public_id,
    collectionName,
    refetchCollectionImages: refetch,
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

export default CollectionImage;
