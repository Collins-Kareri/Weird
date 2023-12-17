import React, { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import Collections from "@src/client/components/collections/collections.currentUser";
import CreateCollection from "@components/modals/createCollection";
import Button from "@components/button";
import Logo from "@assets/logo.svg";
import ProfilePic from "@pages/profile/profilePic";
import Masonary from "@components/my_layouts/masonary";
import My_Tabs from "@components/tabs";
import { useUser } from "@context/user.context";
import { ProfileBody, UserImage } from "@pages/user";
import { useNotification } from "@context/notifications.context";
import generateKey from "@src/shared/utils/generateKeys";

interface PlaceHolderContentPropTypes {
    active: string;
    setCollectionsModalStatus: React.Dispatch<React.SetStateAction<string>>;
    noOfCollections?: number;
    noOfImages?: number;
}

interface PlaceholderContentToShow {
    images: { msg: string; callToAction: string };
    collections: { msg: string; callToAction: string };
}

function PlaceHolderContent({
    active,
    setCollectionsModalStatus,
    noOfCollections,
    noOfImages,
}: PlaceHolderContentPropTypes) {
    const placeholderContent: PlaceholderContentToShow = {
        images: {
            msg: "Publish an image. Join the community.",
            callToAction: "publish",
        },
        collections: {
            msg: "Start curating images. Start a collection.",
            callToAction: "create",
        },
    };

    if (
        (noOfCollections && noOfCollections > 0 && active === "collections") ||
        (noOfImages && noOfImages > 0 && active === "images")
    ) {
        return <></>;
    }

    const redirect = useNavigate();

    function handleClick() {
        if (active === "images") {
            redirect("/publish", { state: { from: "/profile" } });
            return;
        }

        setCollectionsModalStatus("open");
    }

    return (
        <div
            className="tw-flex tw-flex-col tw-w-fit tw-mx-auto tw-justify-center tw-items-center tw-mb-11 tw-p-4"
            id="placeholderContent"
        >
            <img src={Logo as string} alt="app logo" className="tw-relative tw-w-8/12" />
            <span className="tw-font-Quicksand tw-font-medium tw-text-center">
                {placeholderContent[active as keyof PlaceholderContentToShow].msg}
            </span>
            <Button
                priority={"secondary"}
                value={placeholderContent[active as keyof PlaceholderContentToShow].callToAction}
                extraStyles={"tw-mt-4"}
                handleClick={handleClick}
            />
        </div>
    );
}

function Profile() {
    const [activeTab, setActiveTab] = useState("images");
    const [collectionsModalStatus, setCollectionsModalStatus] = useState("closed");
    const { currentUser, setUser } = useUser();
    const redirect = useNavigate();
    const location = useLocation();
    const [editImageModalStatus, setEditImageModalStatus] = useState(false);
    const { addNotification } = useNotification();
    const { data, refetch } = useQuery(
        ["fetchUserMedia", activeTab, currentUser],
        async () => {
            let results;
            if (activeTab === "images" && currentUser && currentUser?.noOfUploadedImages > 0) {
                results = await (await fetch(`/api/image/${currentUser.username}?skip=0&limit=6`)).json();
                return results.images;
            } else if (activeTab === "collections" && currentUser && currentUser.noOfCollections > 0) {
                results = await (await fetch(`/api/collection/${currentUser.username}}?skip=0&limit=6`)).json();
                return results.collections;
            } else {
                return [];
            }
        },
        { refetchInterval: 2 }
    );

    function toggleEditImageModal() {
        setEditImageModalStatus(!editImageModalStatus);
        return;
    }

    function deleteImage(public_id: string) {
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

                    refetch();
                }
            })
            .catch(() => {
                addNotification({ type: "error", msg: "Could not delete image." });
            });
    }

    function closeCollectionModal() {
        setCollectionsModalStatus("closed");
        return;
    }

    return location.pathname === "/profile" ? (
        <ProfileBody>
            <ProfilePic />

            <section className="tw-flex tw-flex-col tw-items-center tw-justify-center" id="profileInfo">
                <span className="tw-text-lg" id="username">
                    {currentUser?.username}
                </span>
                <span className="tw-text-lg" id="email">
                    {currentUser?.email}
                </span>
                <Button
                    priority={"primary"}
                    value={"edit profile"}
                    handleClick={() => {
                        redirect("/profile/edit");
                        return;
                    }}
                    extraStyles={"tw-mt-2"}
                />
            </section>

            {/*tabs component takes an array of tabs with information to display and name to be displayed*/}
            <My_Tabs
                setActiveTab={setActiveTab}
                activeTab={activeTab}
                tabs={[
                    {
                        name: "images",
                        information: `images ${
                            currentUser && currentUser.noOfUploadedImages ? currentUser.noOfUploadedImages : 0
                        }`,
                    },
                    {
                        name: "collections",
                        information: `collections ${
                            currentUser && currentUser.noOfCollections ? currentUser.noOfCollections : 0
                        }`,
                    },
                ]}
            />

            {/**placeholder */}
            <PlaceHolderContent
                active={activeTab}
                setCollectionsModalStatus={setCollectionsModalStatus}
                noOfCollections={currentUser?.noOfCollections}
                noOfImages={currentUser?.noOfUploadedImages}
            />

            {/**create collection */}
            {collectionsModalStatus === "open" && <CreateCollection closeCollectionModal={closeCollectionModal} />}

            {/**collection grid container */}
            {activeTab === "collections" && currentUser?.noOfCollections && currentUser?.noOfCollections > 0 ? (
                <Collections username={currentUser?.username} noOfCollections={currentUser.noOfCollections} />
            ) : (
                <></>
            )}

            {/**image grid container */}
            {activeTab === "images" && currentUser?.noOfUploadedImages && currentUser?.noOfUploadedImages > 0 ? (
                <Masonary>
                    {data &&
                        data.map((val: { url: string; public_id: string }) => {
                            return (
                                <UserImage src={val.url} key={generateKey()} alt_description={""}>
                                    <div className="tw-absolute tw-p-2 tw-px-4 tw-z-10 tw-top-0 tw-bg-neutral-100 tw-w-full tw-bg-opacity-50 tw-bg-blend-soft-light">
                                        <Button
                                            priority={"secondary"}
                                            value={"edit"}
                                            extraStyles={"tw-ring-neutral-900"}
                                            handleClick={toggleEditImageModal}
                                        />
                                        <Button
                                            priority={"tertiary"}
                                            value={"delete"}
                                            handleClick={() => {
                                                deleteImage(val.public_id);
                                            }}
                                        />
                                    </div>
                                </UserImage>
                            );
                        })}
                </Masonary>
            ) : (
                <></>
            )}
        </ProfileBody>
    ) : (
        <Outlet />
    );
}

export default Profile;
