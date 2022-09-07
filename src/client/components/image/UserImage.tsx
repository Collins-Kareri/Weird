import { useNotification } from "@context/notifications.context";
import React, { useState } from "react";
import { RefetchOptions, RefetchQueryFilters, QueryObserverResult } from "react-query";
import Button from "@components/button";
import EditUserImage from "@components/modals/editUserImage";

export interface UserProfileImageBodyProps {
    url: string;
    public_id: string;
    toggleEditImageModal?: () => void;
    refetchUserImages?: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
    ) => Promise<QueryObserverResult<unknown, unknown>>;
}

function UserImage({ url, public_id, refetchUserImages }: UserProfileImageBodyProps) {
    const [editImageModalStatus, setEditImageModalStatus] = useState(false);
    const { addNotification } = useNotification();

    function toggleEditImageModal() {
        setEditImageModalStatus(!editImageModalStatus);
        return;
    }

    function deleteImage() {
        fetch(`/api/image/:${public_id}`, {
            method: "delete",
        })
            .then((res) => {
                if (res.status >= 400) {
                    throw "cannot delete";
                }
                return res.json();
            })
            .then((parsedRes) => {
                if (parsedRes.msg === "ok") {
                    addNotification({ type: "success", msg: "Successfully delete." });
                    if (refetchUserImages) {
                        refetchUserImages();
                    }
                }
            })
            .catch(() => {
                addNotification({ type: "error", msg: "Could not delete image." });
            });
    }

    return (
        <>
            {editImageModalStatus && (
                <EditUserImage url={url} public_id={public_id} toggleEditImageModal={toggleEditImageModal} />
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
                        <Button priority={"tertiary"} value={"delete"} handleClick={deleteImage} />
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

export default UserImage;
