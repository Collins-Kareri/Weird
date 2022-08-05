import React, { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@components/button";
import AddIcon from "@components/addIcon";
import notificationContext from "@context/notifications.context";
import Spinner from "@components/spinner";
import Close from "@components/closeIcon";
import TagsInput from "@components/tagsInput";

interface imgObj {
    url: string;
    base64Rep: string | ArrayBuffer;
}

function Publish() {
    const navigate = useNavigate();
    const fileBrowseEl = useRef(null);
    const notifications = useContext(notificationContext);
    const [isLoading, setIsLoading] = useState(false);
    const [currentImg, setCurrentImg] = useState<imgObj | undefined>(undefined);
    const [tags, setTags] = useState<[] | string[]>([]);

    function cancel(): void {
        //go back to previous page
        navigate(-1);
        return;
    }

    async function readImgData(imgData: File) {
        try {
            const reader = new FileReader();
            reader.readAsDataURL(imgData);

            reader.addEventListener("loadstart", () => {
                //is loading true;
                setIsLoading(true);
            });

            reader.addEventListener("load", (evt) => {
                const base64Str = evt.target?.result;

                if (base64Str) {
                    setCurrentImg({ url: URL.createObjectURL(imgData), base64Rep: base64Str });
                }
                setIsLoading(false);
            });

            reader.addEventListener("error", () => {
                setIsLoading(false);
                notifications.setCurrentNotifications([
                    { type: "error", msg: "Error occurred while processing your image. Please try again" },
                ]);
            });
        } catch (error) {
            setIsLoading(false);
            notifications.setCurrentNotifications([
                { type: "error", msg: "couldn't process your selected image. Please try again" },
            ]);
            return;
        }
    }

    async function handleSelectedImage(evt: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        const fileData = evt.target.files?.item(0);
        if (!fileData) {
            notifications.setCurrentNotifications([{ type: "error", msg: "No image was selected." }]);
            return;
        }

        if (/^image\/\w+$/gi.test(fileData?.type as string)) {
            readImgData(fileData);
            return;
        }

        notifications.setCurrentNotifications([{ type: "error", msg: "Only image file types are allowed." }]);
        return;
    }

    function browseFiles(evt: React.MouseEvent): void {
        evt.stopPropagation();

        if (isLoading) {
            return;
        }

        if (fileBrowseEl.current) {
            (fileBrowseEl.current as HTMLInputElement).click();
        }

        return;
    }

    function removeImg(): void {
        setCurrentImg(undefined);
        return;
    }

    function publish(): void {
        // const tagsInput = document.getElementById("tags");
        // const descriptionInput = document.getElementById("description");
        // console.log((tagsInput as HTMLInputElement).value);
        // console.log((descriptionInput as HTMLTextAreaElement).value);
    }

    return (
        <div className="tw-flex tw-w-11/12 tw-container tw-mx-auto tw-h-screen tw-flex-col tw-justify-center tw-items-center tw-font-Quicksand md:tw-max-w-md">
            <input
                type={"file"}
                ref={fileBrowseEl}
                className="tw-hidden"
                accept="image/*"
                id="fileBrowse"
                onChange={handleSelectedImage}
            />

            {/* container */}
            <div className="tw-w-full tw-border-neutral-300 tw-shadow-md tw-shadow-neutral-400 tw-bg-neutral-100  tw-border-solid tw-border tw-p-4 tw-h-fit tw-rounded-md">
                {/* image container */}
                <div className="tw-w-full tw-h-56 tw-relative tw-rounded-md tw-mb-2 tw-shadow-inner tw-shadow-neutral-700 tw-bg-neutral-300 ">
                    {
                        /*browse images */
                        !currentImg && (
                            <section
                                className="tw-relative tw-w-full tw-h-full hover:tw-cursor-pointer"
                                onClick={browseFiles}
                            >
                                <AddIcon
                                    backgroundColor={"tw-bg-neutral-800"}
                                    shadowColor={"tw-shadow-neutral-800"}
                                    fillColor={"tw-fill-neutral-300"}
                                    strokeColor={"tw-stroke-neutral-300"}
                                    position={"tw-absolute -tw-translate-x-1/2 tw-inset-1/2 -tw-translate-y-1/2"}
                                    extraStyle={
                                        "tw-mix-blend-hard-light tw-ring-1 hover:tw-ring-offset-2 hover:tw-ring-offset-neutral-800"
                                    }
                                    onClick={browseFiles}
                                />
                                {/*loading image display spinner */}
                                {isLoading && (
                                    <section className="tw-flex tw-h-full tw-w-full tw-bg-neutral-300 tw-opacity-70 tw-flex-row tw-justify-center tw-items-center tw-flex-wrap tw-z-40 tw-absolute">
                                        <Spinner
                                            height={"tw-h-12"}
                                            width={"tw-w-12"}
                                            borderColor={"tw-border-neutral-800"}
                                            position={"tw-relative"}
                                        />
                                    </section>
                                )}
                            </section>
                        )
                    }

                    {currentImg && (
                        <section className="tw-relative tw-w-full tw-h-full ">
                            <Close
                                backgroundColor={"tw-bg-neutral-800"}
                                shadowColor={"tw-shadow-neutral-800"}
                                fillColor={"tw-fill-neutral-300"}
                                strokeColor={"tw-stroke-neutral-300"}
                                position={"tw-absolute tw-z-50 tw-right-2 tw-top-2"}
                                extraStyle={
                                    "tw-mix-blend-hard-light hover:tw-cursor-pointer tw-shadow-lg tw-shadow-neutral-700"
                                }
                                onClick={removeImg}
                            />
                            <img
                                src={currentImg.url}
                                className={" tw-relative tw-w-full tw-h-full tw-object-cover tw-rounded-md"}
                            />
                        </section>
                    )}
                </div>

                {/* tags input */}
                <TagsInput tags={tags} setTags={setTags} />

                {/* description input */}
                <label
                    htmlFor="description"
                    className="tw-block tw-font-semibold tw-m-2 tw-text-neutral-900 tw-text-lg"
                >
                    Description
                </label>
                <textarea
                    className="tw-w-full tw-text-neutral-900 tw-bg-neutral-200 tw-rounded-md focus:tw-ring-normal-800 valid:tw-ring-success-700 tw-ring-1 tw-outline-none tw-border-none invalid:tw-ring-error-700 "
                    placeholder="Photo description"
                    name="description"
                    id="description"
                />

                {/*Buttons */}
                <section className="tw-flex tw-justify-start tw-w-full tw-mt-4">
                    <Button priority={"secondary"} value={"cancel"} handleClick={cancel} extraStyles={"tw-mr-4"} />
                    <Button priority={"primary"} value={"publish"} handleClick={publish} />
                </section>
            </div>
        </div>
    );
}

export default Publish;
