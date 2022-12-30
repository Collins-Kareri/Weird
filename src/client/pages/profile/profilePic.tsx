/* eslint-disable prettier/prettier */
import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "@context/user.context";
import ImageInput from "@src/client/components/imageComponents/image.input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@components/button";
import Spinner from "@components/spinner";
import { useNotification } from "@context/notifications.context";

function ProfilePic() {
    /**Contains ref to hidden input type file */
    const browseFilesElement = useRef(null);
    const { setUser, currentUser } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const { addNotification } = useNotification();

    /**
     * Open input type file on element click.
     * @returns void
     */
    function openFileBrowser(evt: React.MouseEvent) {
        evt.stopPropagation();

        if (browseFilesElement.current) {
            (browseFilesElement.current as HTMLInputElement).click();
        }

        return;
    }

    /**
     * Upload profile picture logic.
     * @returns Promise<boolean>
     */
    async function publishProfilePic(base64Str: string | ArrayBuffer): Promise<boolean> {
        //sends to cloudinary then send to neo4j
        //deletes current profile image

        try {
            const signatureRes = await (await fetch("/api/image/signature/:profilePic", { method: "get" })).json();
            console.log(signatureRes);
            const cloudinaryUrl = process.env.My_CLOUDINARY_URL as string;
            const cloudinaryDeleteByToken = process.env.My_CLOUDINARY_URL as string;

            if (signatureRes.msg === "fail" || typeof signatureRes.msg === "undefined") {
                setIsLoading(!isLoading);
                return false;
            }

            //data required to upload to cloudinary
            const uploadData = new FormData();

            uploadData.append("file", base64Str as string);
            uploadData.append("signature", signatureRes.signature);
            uploadData.append("timestamp", signatureRes.timestamp);
            uploadData.append("api_key", signatureRes.apiKey);
            uploadData.append("folder", "profilePictures_Weird");

            if (currentUser?.profilePic) {
                uploadData.append("public_id", currentUser?.profilePic?.public_id as string);
            }

            uploadData.append("upload_preset", "profilePic");

            //cloudinary upload request
            const uploadImage: CloudinaryRes = await (
                await fetch(cloudinaryUrl, { method: "post", body: uploadData })
            ).json();

            console.log(uploadImage);
            //update user details

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

                //if update user details fails
                if (updateUser.msg.toLowerCase() !== "successful" || typeof updateUser.msg === "undefined") {
                    const deleteToken = new FormData();
                    deleteToken.append("token", delete_token);

                    await fetch(cloudinaryDeleteByToken, {
                        method: "post",
                        body: deleteToken,
                    });

                    throw "failed";
                }

                setUser({ profilePic: { public_id: public_id, url: secure_url }, ...currentUser });

                return true;
            }

            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    /**
     * Delete profile picture logic.
     * @returns void
     */
    async function deleteProfilePic() {
        try {
            if (currentUser?.profilePic && currentUser.profilePic.public_id) {
                setIsLoading(true);

                fetch("/api/image/profileImage/delete", {
                    method: "delete",
                })
                    .then((res) => res.json())
                    .then((parsedRes) => {
                        if (parsedRes.msg.toLowerCase() !== "ok") {
                            throw "fail";
                        }

                        setIsLoading(false);
                        setUser(parsedRes.user);
                        addNotification({ type: "success", msg: "successfully deleted profile image." });
                    })
                    .catch(() => {
                        setIsLoading(false);
                        addNotification({ type: "error", msg: "failed deleting profile image" });
                    });

                return;
            }

            return;
        } catch (error) {
            addNotification({ type: "error", msg: "failed to delete profile picture" });
            return;
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
                <span
                    className={"tw-bg-neutral-300 tw-rounded-full tw-inline-block tw-w-28 tw-h-28"}
                    id="profilePicContainer"
                >
                    {currentUser?.profilePic && (
                        <img
                            className="tw-object-cover tw-rounded-full tw-w-full tw-h-full tw-relative"
                            src={currentUser.profilePic.url}
                            alt={"profile picture"}
                            id="profilePic"
                        />
                    )}
                </span>

                {/**edit profie pic icon and delete icon*/}
                {isLoading === false && (
                    <div
                        className="tw-absolute tw-bottom-0 tw-right-0 tw-w-8 tw-h-8 tw-bg-neutral-800 tw-rounded-full tw-flex tw-flex-row tw-justify-center tw-items-center tw-cursor-pointer md:tw-h-9 md:tw-w-9 tw-ring tw-ring-neutral-800 tw-border-0 hover:tw-ring-offset-1 hover:tw-ring-offset-neutral-800 main-transition tw-text-primary-300"
                        onClick={(evt) => {
                            currentUser?.profilePic && currentUser.profilePic.url
                                ? deleteProfilePic()
                                : openFileBrowser(evt);
                        }}
                        id="editProfilePic"
                    >
                        {currentUser?.profilePic && currentUser.profilePic.url ? (
                            <FontAwesomeIcon icon={"trash"} />
                        ) : (
                            <FontAwesomeIcon icon={"pencil"} />
                        )}
                    </div>
                )}
            </section>

            {location.pathname === "/profile/edit" && (
                <div
                    className="tw-flex tw-flex-row tw-justify-center tw-w-full tw-m-0 tw-mb-7"
                    data-within="profilePicActions"
                >
                    <Button
                        priority={"secondary"}
                        value={"change"}
                        extraStyles={"tw-mt-0 tw-mr-4"}
                        handleClick={openFileBrowser}
                        isLoading={isLoading}
                    />
                    <Button
                        priority={"tertiary"}
                        value={"delete"}
                        isLoading={isLoading}
                        handleClick={() => {
                            deleteProfilePic();
                            return;
                        }}
                    />
                </div>
            )}
        </>
    );
}

export default ProfilePic;
