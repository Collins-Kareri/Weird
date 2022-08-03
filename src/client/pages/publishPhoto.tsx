import React, { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@components/button";
import Input from "@components/inputField";
import AddIcon from "@components/addIcon";
import notificationContext from "@context/notifications.context";

function Publish() {
    const navigate = useNavigate();
    const fileBrowseEl = useRef(null);
    const notifications = useContext(notificationContext);
    const [isLoading, setIsLoading] = useState(false);

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
                console.log(evt.target?.result);
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
        console.log(!fileData);
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

    function browseFiles(evt: React.MouseEvent<HTMLElement, MouseEvent>): void {
        evt.stopPropagation();
        if (fileBrowseEl.current) {
            (fileBrowseEl.current as HTMLInputElement).click();
        }

        return;
    }

    return (
        <div className="tw-flex tw-w-11/12 tw-container tw-mx-auto tw-h-screen tw-flex-col tw-justify-center tw-items-center tw-font-Quicksand">
            <input
                type={"file"}
                ref={fileBrowseEl}
                className="tw-hidden"
                accept="image/*"
                onChange={handleSelectedImage}
            />

            {/* container */}
            <div className="tw-w-full tw-border-primary-300 tw-shadow-md tw-shadow-primary-400 tw-bg-primary-100  tw-border-solid tw-border tw-p-4 tw-h-fit tw-rounded-md">
                {/* image container */}
                <div className="tw-w-full tw-h-56 tw-relative tw-rounded-md tw-mb-2 tw-shadow-inner tw-shadow-primary-700 tw-bg-primary-300 ">
                    <section className="tw-relative tw-w-full tw-h-full hover:tw-cursor-pointer" onClick={browseFiles}>
                        <AddIcon
                            backgroundColor={"tw-bg-primary-800"}
                            shadowColor={"tw-shadow-primary-800"}
                            fillColor={"tw-fill-primary-200"}
                            strokeColor={"tw-stroke-primary-200"}
                            position={"tw-absolute -tw-translate-x-1/2 tw-inset-1/2 -tw-translate-y-1/2"}
                            onClick={browseFiles}
                        />
                    </section>
                </div>

                {/* tags input */}
                <Input
                    type={"text"}
                    label={"tags"}
                    placeholder={"Tags"}
                    name={"tags"}
                    handleChange={() => {
                        return;
                    }}
                />

                {/* description input */}
                <label htmlFor="description" className="tw-font-medium tw-m-2 tw-text-neutral-900">
                    Description
                </label>
                <textarea
                    className="tw-w-full tw-text-neutral-900 tw-bg-primary-200 tw-rounded-md focus:tw-ring-normal-800 valid:tw-ring-success-700 tw-ring-1 tw-outline-none tw-border-none invalid:tw-ring-error-700 "
                    placeholder="Photo description"
                    name="description"
                />

                {/*Buttons */}
                <section className="tw-flex tw-justify-start tw-w-full tw-mt-4">
                    <Button priority={"secondary"} value={"cancel"} handleClick={cancel} extraStyles={"tw-mr-4"} />
                    <Button priority={"primary"} value={"publish"} />
                </section>
            </div>
        </div>
    );
}

export default Publish;
