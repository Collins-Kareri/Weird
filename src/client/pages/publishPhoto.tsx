import React, { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ImageInput, { ImgObj } from "@src/client/components/imageComponents/image.input";
import Button from "@components/button";
import AddIcon from "@src/client/components/iconsComponents/addIcon";
import { useNotification } from "@context/notifications.context";
import { useUser } from "@context/user.context";
import Spinner from "@components/spinner";
import Close from "@src/client/components/iconsComponents/closeIcon";
import TagsInput from "@src/client/components/imageComponents/tags.input";
import TextArea from "@components/form/textArea";
import Popover from "@components/modals/popover";

interface PageBodyProps {
    currentImg: ImgObj | undefined;
    browseFilesElement: React.MutableRefObject<null>;
    setImageData: React.Dispatch<React.SetStateAction<ImgObj | undefined>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    cancel: () => void;
    publishPhoto: () => void;
    browseFiles: (evt: React.MouseEvent) => void;
    isLoading: boolean;
    removeImg: () => void;
    tags: [] | string[];
    setTags: React.Dispatch<React.SetStateAction<[] | string[]>>;
}

function PageBody({
    currentImg,
    browseFilesElement,
    setImageData,
    cancel,
    publishPhoto,
    browseFiles,
    isLoading,
    removeImg,
    tags,
    setTags,
    setIsLoading,
}: PageBodyProps) {
    return (
        <div className="tw-flex tw-w-11/12 tw-container tw-mx-auto tw-h-screen tw-flex-col tw-justify-center tw-items-center tw-font-Quicksand md:tw-max-w-md">
            <ImageInput
                browseFilesElement={browseFilesElement}
                setParentImageData={setImageData}
                setIsLoading={setIsLoading}
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
                                id="imageEl"
                            />
                        </section>
                    )}
                </div>

                {/* tags input */}
                <TagsInput tags={tags} setTags={setTags} />

                {/* description input */}
                <TextArea name={"description"} label={"description"} placeHolder={"Photo description"} />

                {/*Buttons */}
                <section className="tw-flex tw-justify-start tw-w-full tw-mt-4">
                    <Button
                        priority={"secondary"}
                        value={"cancel"}
                        handleClick={cancel}
                        extraStyles={"tw-mr-4"}
                        typeOfButton="button"
                    />
                    <Button
                        priority={"primary"}
                        value={"publish"}
                        handleClick={() => {
                            publishPhoto();
                            return;
                        }}
                        typeOfButton={"submit"}
                    />
                </section>
            </div>
        </div>
    );
}

function Publish() {
    const navigate = useNavigate();
    const location = useLocation();
    const browseFilesElement = useRef(null);
    const { addNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const [imgData, setImgData] = useState<ImgObj | undefined>(undefined);
    const [tags, setTags] = useState<[] | string[]>([]);
    const [uploadFeedback, setUploadFeedback] = useState("");
    const { setUser } = useUser();

    function cancel(): void {
        if (location.state) {
            navigate((location.state as LocationState).from);
            return;
        }

        navigate("/");

        return;
    }

    function browseFiles(evt: React.MouseEvent): void {
        evt.stopPropagation();

        if (isLoading) {
            return;
        }

        if (browseFilesElement.current) {
            (browseFilesElement.current as HTMLInputElement).click();
        }

        return;
    }

    async function removeImg(): Promise<void> {
        setImgData(undefined);
        const imageEl = document.querySelector("#fileBrowse") as HTMLInputElement;
        imageEl.value = "";
        return;
    }

    async function publishPhoto(): Promise<void> {
        //send tags, description and image base 64 url to cloudinary, then send the public url to backend to store in server
        const description = (document.getElementById("description") as HTMLTextAreaElement).value;
        const cloudinaryUrl = process.env.My_CLOUDINARY_URL as string;

        if (!imgData) {
            addNotification({ type: "error", msg: "no image was selected." });
            return;
        }

        if (tags.length <= 0) {
            addNotification({ type: "error", msg: "tags are required" });
            return;
        }

        if (description.length <= 0) {
            addNotification({ type: "error", msg: "description is required" });
            return;
        }

        // eslint-disable-next-line prettier/prettier
        const signatureRes = await(
            await fetch("/api/image/signature/:weird", {
                method: "post",
                body: JSON.stringify({ context: `alt=${description}`, tags: tags.toString().replace(/\[|\]/g, "") }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
        ).json();

        if (signatureRes.msg === "fail" || typeof signatureRes.msg === "undefined") {
            setIsLoading(!isLoading);
            return;
        }

        const uploadData = new FormData();

        uploadData.append("file", imgData?.base64Rep as string);
        uploadData.append("upload_preset", "weird");
        uploadData.append("tags", tags.toString().replace(/\[|\]/g, ""));
        uploadData.append("context", `alt=${description}`);
        uploadData.append("signature", signatureRes.signature);
        uploadData.append("timestamp", signatureRes.timestamp);
        uploadData.append("api_key", signatureRes.apiKey);
        uploadData.append("folder", "weird");
        uploadData.append("detection", "unidet");
        uploadData.append("auto_tagging", "0.5");

        fetch(cloudinaryUrl, { body: uploadData, method: "post" })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }

                throw new Error("Couldn't upload image");
            })
            .then(async (parsedJsonRes) => {
                const { public_id, asset_id, url, secure_url } = parsedJsonRes as unknown as CloudinaryRes;

                const dbRes = await (
                    await fetch("/api/image/publish", {
                        method: "post",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ public_id, asset_id, url, secure_url }),
                    })
                ).json();

                switch (dbRes.msg.toLowerCase()) {
                    case "published":
                        //todo popover message redirect to user
                        setUploadFeedback("success");
                        setUser(dbRes.user);
                        return;
                    default:
                        //todo delete the image from cloudinary using the public_id
                        //fetch(`api/image/:${asset_id}`, { method: "delete" });
                        addNotification({ type: "error", msg: "cannot publish image" });
                        return;
                }
            })
            .catch(() => {
                addNotification({ type: "error", msg: "error occured uploading." });
            });
    }

    //navigate to profile on successful upload
    function uploadFeedbackPrimaryAction(): void {
        navigate("/profile", { replace: true });
        return;
    }

    return uploadFeedback === "success" ? (
        <Popover
            secondaryAction={false}
            message={"Image uploaded successfully. You will be redirected to your profile."}
            handlePrimaryAction={uploadFeedbackPrimaryAction}
            primaryActionValue={"ok"}
        />
    ) : (
        <PageBody
            currentImg={imgData}
            browseFilesElement={browseFilesElement}
            setImageData={setImgData}
            cancel={cancel}
            publishPhoto={publishPhoto}
            browseFiles={browseFiles}
            isLoading={isLoading}
            removeImg={removeImg}
            tags={tags}
            setTags={setTags}
            setIsLoading={setIsLoading}
        />
    );
}

export default Publish;
