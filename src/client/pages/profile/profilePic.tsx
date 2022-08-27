import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "@context/user.context";
import ImageInput from "@components/imageInput";
import EditIcon from "@assets/edit.svg";
import Button from "@components/button";
import Spinner from "@components/spinner";

function ProfilePic() {
    const browseFilesElement = useRef(null);
    const { setUser, currentUser } = useUser();
    const [isLoading, setIsLoading] = useState(false);
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

        try {
            const signatureRes = await (await fetch("/api/image/signature/:profilePic", { method: "get" })).json();
            const cloudinaryUrl = "https://api.cloudinary.com/v1_1/karerisspace/image/upload";
            const cloudinaryDeleteByToken = "https://api.cloudinary.com/v1_1/karerisspace/delete_by_token";

            if (signatureRes.msg === "fail" || typeof signatureRes.msg === "undefined") {
                setIsLoading(!isLoading);
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
                const { public_id, secure_url, delete_token } = uploadImage;
                const updateUser = await (
                    await fetch("/api/user/update", {
                        method: "put",
                        body: JSON.stringify({ public_id, url: secure_url }),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                ).json();

                if (updateUser.msg.toLowerCase() !== "successful") {
                    const deleteToken = new FormData();
                    deleteToken.append("token", delete_token);

                    await fetch(cloudinaryDeleteByToken, {
                        method: "post",
                        body: deleteToken,
                    });

                    throw "failed";
                }

                setUser({ profilePic: { public_id, url: secure_url }, ...currentUser });
                return true;
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    return (
        <>
            <ImageInput
                browseFilesElement={browseFilesElement}
                publishImage={publishProfilePic}
                setIsLoading={setIsLoading}
            />

            {/**profile image*/}
            <section
                className={`tw-relative tw-mb-4 md:tw-mx-4 tw-flex tw-flex-col tw-items-center tw-justify-center ${
                    isLoading ? "tw-cursor-wait" : "tw-cursor-auto"
                }`}
            >
                {isLoading && (
                    <div className="tw-absolute tw-bg-primary-500 tw-bg-opacity-50 tw-w-full tw-h-full tw-rounded-full tw-flex tw-justify-center tw-items-center">
                        <Spinner height={"tw-h-8"} width={"tw-w-8"} borderColor={""} position={""} />
                    </div>
                )}
                <span className={"tw-bg-neutral-300 tw-rounded-full tw-inline-block tw-w-28 tw-h-28"}>
                    {currentUser?.profilePic && (
                        <img
                            className="tw-object-cover tw-rounded-full tw-w-full tw-h-full tw-relative"
                            src={currentUser.profilePic.url}
                            alt={"profile picture"}
                        />
                    )}
                </span>

                {/**edit profie pic icon*/}
                {isLoading === false && (
                    <div
                        className="tw-absolute tw-bottom-0 tw-right-0 tw-w-8 tw-h-8 tw-bg-neutral-800 tw-rounded-full tw-flex tw-flex-row tw-justify-center tw-items-center tw-cursor-pointer md:tw-h-9 md:tw-w-9 tw-ring tw-ring-neutral-800 tw-border-0 hover:tw-ring-offset-1 hover:tw-ring-offset-neutral-800 main-transition"
                        onClick={openFileBrowser}
                    >
                        <img src={EditIcon as string} alt="edit icon" className="tw-w-9/12" />
                    </div>
                )}
            </section>

            {location.pathname === "/profile/edit" && (
                <div className="tw-flex tw-flex-row tw-justify-center tw-w-full tw-m-0 tw-mb-7">
                    <Button
                        priority={"secondary"}
                        value={"change"}
                        extraStyles={"tw-mt-0 tw-mr-4"}
                        handleClick={openFileBrowser}
                        isLoading={isLoading}
                    />
                    <Button priority={"tertiary"} value={"delete"} isLoading={isLoading} />
                </div>
            )}
        </>
    );
}

export default ProfilePic;
