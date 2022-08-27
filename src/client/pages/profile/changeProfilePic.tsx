import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "@context/user.context";
import ImageInput, { ImgObj } from "@components/imageInput";
import EditIcon from "@assets/edit.svg";
import Button from "@components/button";

function ChangeProfilePic() {
    const browseFilesElement = useRef(null);
    const { setUser, currentUser } = useUser();
    const [profilePic, setProfilePic] = useState<ImgObj | undefined>(undefined);
    const location = useLocation();

    function openFileBrowser(evt: React.MouseEvent) {
        evt.stopPropagation();

        if (browseFilesElement.current) {
            (browseFilesElement.current as HTMLInputElement).click();
        }

        return;
    }

    async function publishProfilePic(base64Str: string | ArrayBuffer): Promise<boolean> {
        //todo send to cloudinary then send to neo4j
        //todo delete current image
        const signatureRes = await (await fetch("/api/images/signature")).json();
        const cloudinaryUrl = "https://api.cloudinary.com/v1_1/karerisspace/image/upload";

        if (signatureRes.msg === "fail") {
            return false;
        }

        const uploadData = new FormData();

        uploadData.append("file", base64Str as string);
        uploadData.append("signature", signatureRes.signature);
        uploadData.append("timestamp", signatureRes.timestamp);
        uploadData.append("api_key", signatureRes.apiKey);

        if (currentUser?.profilePic) {
            uploadData.append("public_id", currentUser?.profilePic?.public_id as string);
        }

        uploadData.append("upload_preset", "profilePic");

        const uploadImage: CloudinaryRes = await (
            await fetch(cloudinaryUrl, { method: "post", body: uploadData })
        ).json();

        if (uploadImage.url && currentUser) {
            const { public_id, secure_url } = uploadImage;
            setUser({ profilePic: { public_id, url: secure_url }, ...currentUser });
            return true;
        }

        return false;
    }

    return (
        <>
            <ImageInput
                browseFilesElement={browseFilesElement}
                publishImage={publishProfilePic}
                setParentImageData={setProfilePic}
            />

            {/**profile image*/}
            <section className="tw-relative tw-mb-4 md:tw-mx-4 tw-flex tw-flex-col tw-items-center tw-justify-center">
                <span className="tw-bg-neutral-300 tw-rounded-full tw-inline-block tw-w-28 tw-h-28">
                    {profilePic && (
                        <img
                            className="tw-object-cover tw-rounded-full tw-w-full tw-h-full tw-relative"
                            src={profilePic.url}
                            alt={"profile picture"}
                        />
                    )}
                </span>

                {/**edit profie pic icon*/}
                <div
                    className="tw-absolute tw-bottom-0 tw-right-0 tw-w-8 tw-h-8 tw-bg-neutral-800 tw-rounded-full tw-flex tw-flex-row tw-justify-center tw-items-center tw-cursor-pointer md:tw-h-9 md:tw-w-9 tw-ring tw-ring-neutral-800 tw-border-0 hover:tw-ring-offset-1 hover:tw-ring-offset-neutral-800 main-transition"
                    onClick={openFileBrowser}
                >
                    <img src={EditIcon as string} alt="edit icon" className="tw-w-9/12" />
                </div>
            </section>

            {location.pathname === "/profile/edit" && (
                <Button
                    priority={"secondary"}
                    value={"change profile picture"}
                    extraStyles={"tw-mt-0"}
                    handleClick={openFileBrowser}
                />
            )}
        </>
    );
}

export default ChangeProfilePic;
