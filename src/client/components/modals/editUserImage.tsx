import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNotification } from "@context/notifications.context";
import TagsInput from "@components/image/tagsInput";
import TextArea from "@components/form/textArea";
import CloseIcon from "@components/icons/closeIcon";
import { UserProfileImageBodyProps } from "@components/image//UserImage";
import Button from "@components/button";

function EditUserImage({ url, public_id, toggleEditImageModal }: UserProfileImageBodyProps) {
    const [tags, setTags] = useState<[] | string[]>([]);
    const { data, isError, error, isLoading, isSuccess, refetch } = useQuery(
        "fetchImageData",
        async () => {
            public_id;
            return (await fetch(`/api/image/data/:${public_id}`, { method: "get" })).json();
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

    function editImageDetails() {
        const descriptionEl = document.querySelector("#description") as HTMLTextAreaElement;

        function isEqual(arr1: string[], arr2: string[]): boolean {
            if (arr1.length !== arr2.length) {
                return false;
            }

            let results = true;

            for (let index = 0; index <= arr1.length - 1; index++) {
                if (arr1[index] !== arr2[index]) {
                    results = false;
                    break;
                }
            }

            return results;
        }

        //run only when tags or description not equal to the previous value
        if (
            data &&
            data.images &&
            ((data.images.description && descriptionEl.value !== data.images.description) ||
                (data.images.tags && !isEqual(tags, data.images.tags)))
        ) {
            fetch(`/api/image/data/:${public_id}`, {
                method: "put",
                body: JSON.stringify({ tags, descriptionEl: descriptionEl.value }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    if (res.status >= 400) {
                        throw "cannot update";
                    }
                    return res.json();
                })
                .then((parsedRes) => {
                    if (parsedRes.msg === "ok" && parsedRes.images) {
                        addNotification({ type: "success", msg: "Successfully updated." });
                        refetch();
                    }
                })
                .catch(() => {
                    addNotification({ type: "error", msg: "Could not update image data." });
                });
        }
        return;
    }

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

                    {isSuccess && <TagsInput tags={data.image.tags} setTags={setTags} />}
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
                    <Button priority={"primary"} value={"update"} handleClick={editImageDetails} />
                </div>
            </div>
        </>
    );
}

export default EditUserImage;
