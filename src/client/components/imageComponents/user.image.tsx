import { useNotification } from "@context/notifications.context";
import React, { useState } from "react";
import { RefetchOptions, RefetchQueryFilters, QueryObserverResult } from "react-query";
import Button from "@components/button";
import EditUserImage from "@components/modals/editUserImage";
import { useUser } from "@context/user.context";

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
    const { setUser } = useUser();

    function toggleEditImageModal() {
        setEditImageModalStatus(!editImageModalStatus);
        return;
    }

    function deleteImage() {
        fetch(`/api/image/:${public_id.replace("/", "_")}`, {
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
                    if (parsedRes.user) {
                        setUser(parsedRes.user);
                    }

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
        </>
    );
}

export default UserImage;
