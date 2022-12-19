import React, { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Collections from "@components/collections/collections";
import CreateCollection from "@components/modals/createCollection";
import Button from "@components/button";
import Logo from "@assets/logo.svg";
import ProfilePic from "@pages/profile/profilePic";
import Image from "@src/client/components/imageComponents/image";
import { useUser } from "@context/user.context";

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

interface TabsPropTypes {
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    activeTab: string;
    noOfImages: number;
    noOfCollections: number;
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
                handleClick={handleClick}
            />
        </div>
    );
}

function Tabs({ setActiveTab, activeTab, noOfImages, noOfCollections }: TabsPropTypes) {
    const tabStyles = {
        active: "tw-underline tw-underline-offset-8 hover:tw-underline-offset-4",
        inactive: "tw-font-medium  hover:tw-font-semibold hover:tw-underline hover:tw-underline-offset-8",
    };

    function toggleActiveTab(tabName: string) {
        if (activeTab === tabName) {
            return;
        }

        setActiveTab(tabName);
    }
    return (
        <div
            className="tw-flex tw-flex-row tw-justify-start tw-font-Quicksand tw-font-bold tw-text-lg tw-text-neutral-800 tw-p-2 lg:tw-p-4"
            id="tab"
        >
            <span
                className={`tw-p-2 tw-cursor-pointer ${
                    activeTab.toLowerCase() === "images" ? tabStyles.active : tabStyles.inactive
                } main-transition`}
                onClick={() => {
                    toggleActiveTab("images");
                }}
                id="imageTab"
            >
                {`images ${noOfImages}`}
            </span>

            <span
                className={`tw-p-2 tw-cursor-pointer ${
                    activeTab.toLowerCase() === "collections" ? tabStyles.active : tabStyles.inactive
                } main-transition`}
                onClick={() => {
                    toggleActiveTab("collections");
                }}
                id="collectionTab"
            >
                {`collections ${noOfCollections}`}
            </span>
        </div>
    );
}

function Profile() {
    //todo fetch profile images and collections
    const [activeTab, setActiveTab] = useState("images");
    const [collectionsModalStatus, setCollectionsModalStatus] = useState("closed");
    const { currentUser } = useUser();
    const redirect = useNavigate();
    const location = useLocation();

    function closeCollectionModal() {
        setCollectionsModalStatus("closed");
        return;
    }

    return location.pathname === "/profile" ? (
        <>
            <div className=" tw-flex tw-flex-col tw-justify-center tw-items-center  tw-font-Quicksand tw-font-semibold tw-p-4 tw-text-neutral-800 md:tw-flex-row">
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
                    />
                </section>
            </div>

            {/**tabs */}
            <Tabs
                setActiveTab={setActiveTab}
                activeTab={activeTab}
                noOfImages={currentUser && currentUser.noOfUploadedImages ? currentUser.noOfUploadedImages : 0}
                noOfCollections={currentUser && currentUser.noOfUploadedImages ? currentUser.noOfCollections : 0}
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
            {activeTab === "collections" && currentUser?.noOfUploadedImages && currentUser?.noOfCollections > 0 && (
                <Collections username={currentUser?.username} noOfCollections={currentUser.noOfCollections} />
            )}

            {/**image grid container */}
            {activeTab === "images" && currentUser?.noOfUploadedImages && currentUser?.noOfUploadedImages > 0 && (
                <Image username={currentUser?.username} />
            )}
        </>
    ) : (
        <Outlet />
    );
}

export default Profile;
