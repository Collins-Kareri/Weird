import React from "react";
import { useNotification } from "@context/notifications.context";

export interface ImgObj {
    url: string;
    base64Rep: string | ArrayBuffer;
}

interface PropTypes {
    browseFilesElement: React.MutableRefObject<null>;
    setParentImageData?: React.Dispatch<React.SetStateAction<ImgObj | undefined>>;
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
    publishImage?: (base64Str: string | ArrayBuffer) => Promise<boolean>;
}

function ImageInput({ browseFilesElement, setParentImageData, setIsLoading, publishImage }: PropTypes) {
    const { addNotification } = useNotification();

    async function readImgData(imgData: File) {
        try {
            const reader = new FileReader();
            reader.readAsDataURL(imgData);

            reader.addEventListener("loadstart", () => {
                //is loading true;
                if (setIsLoading) {
                    setIsLoading(true);
                }
            });

            reader.addEventListener("load", async (evt) => {
                const base64Str = evt.target?.result;

                if (publishImage && base64Str) {
                    const submitRes = await publishImage(base64Str);

                    if (submitRes) {
                        if (setParentImageData) {
                            setParentImageData({ url: URL.createObjectURL(imgData), base64Rep: base64Str });
                        }

                        addNotification({ type: "success", msg: "profile picture updated." });

                        if (setIsLoading) {
                            setIsLoading(false);
                        }
                    } else {
                        addNotification({ type: "error", msg: "couldn't update profile picture." });
                        if (setIsLoading) {
                            setIsLoading(false);
                        }
                    }

                    return;
                }

                if (base64Str) {
                    if (setParentImageData) {
                        setParentImageData({ url: URL.createObjectURL(imgData), base64Rep: base64Str });
                    }
                }

                if (setIsLoading) {
                    setIsLoading(false);
                }
            });

            reader.addEventListener("error", () => {
                if (setIsLoading) {
                    setIsLoading(false);
                }
                addNotification({ type: "error", msg: "Error occurred while processing your image. Please try again" });
            });
        } catch (error) {
            if (setIsLoading) {
                setIsLoading(false);
            }

            addNotification({ type: "error", msg: "couldn't process your selected image. Please try again" });
            return;
        }
    }

    async function handleSelectedImage(evt: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        const fileData = evt.target.files?.item(0);
        const inputEl = document.querySelector("#fileBrowse") as HTMLInputElement;

        if (!fileData) {
            addNotification({ type: "error", msg: "No image was selected." });
            return;
        }

        if (/^image\/\w+$/gi.test(fileData?.type as string)) {
            readImgData(fileData);
            inputEl.value = "";
            return;
        }

        addNotification({ type: "error", msg: "Only image file types are allowed." });
        inputEl.value = "";
        return;
    }

    return (
        <input
            type={"file"}
            ref={browseFilesElement}
            className="tw-hidden"
            accept="image/*"
            id="fileBrowse"
            onChange={handleSelectedImage}
        />
    );
}

export default ImageInput;
