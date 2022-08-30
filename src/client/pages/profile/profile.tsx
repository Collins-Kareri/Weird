import React, { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import CollectionsModal from "@components/collectionsModal";
import Button from "@components/button";
import Logo from "@assets/logo.svg";
import ProfilePic from "@pages/profile/profilePic";
import { useUser } from "@context/user.context";

interface PlaceHolderContentPropTypes {
    active: string;
    setCollectionsModalStatus: React.Dispatch<React.SetStateAction<string>>;
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

function PlaceHolderContent({ active, setCollectionsModalStatus }: PlaceHolderContentPropTypes) {
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
            <Tabs setActiveTab={setActiveTab} activeTab={activeTab} noOfImages={0} noOfCollections={0} />

            {/**placeholder */}
            <PlaceHolderContent active={activeTab} setCollectionsModalStatus={setCollectionsModalStatus} />

            {/**create collection */}
            {collectionsModalStatus === "open" && <CollectionsModal closeCollectionModal={closeCollectionModal} />}

            <Outlet />

            {/**collection grid container */}
            {/* <div className="tw-container tw-mx-auto tw-p-4 tw-grid tw-grid-flow-row tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-4 2xl:tw-grid-5 tw-place-content-center tw-place-items-center">
                <section className="tw-inline-block tw-bg-neutral-100 tw-w-80 tw-mx-2 tw-h-80 tw-rounded-md tw-px-4 tw-py-2 tw-mb-10 tw-ring-1 tw-ring-neutral-800 ">
                    <Button priority={"secondary"} value={"edit"} />
                    <Button priority={"tertiary"} value={"delete"} />
                    <div className="tw-relative tw-bg-neutral-100 tw-my-4 tw-h-44 tw-rounded-md tw-shadow-inner tw-shadow-neutral-800">
                        <img
                            src={randomImage}
                            alt="random image from fakerjs"
                            className="tw-relative tw-cursor-pointer tw-w-full tw-h-full tw-object-cover tw-rounded-md tw-shadow-inner tw-shadow-neutral-800"
                        />
                    </div>
                    <p className="tw-cursor-pointer tw-font-semibold">{capitalizeFirstChar("collection name")}</p>
                </section>
            </div> */}

            {/**Image container */}
            {/* <div className="tw-container tw-mx-auto tw-p-4 tw-mb-10 tw-columns-1 md:tw-columns-2 lg:tw-columns-3 2xl:tw-columns-4 tw-gap-x-4 tw-w-full">
                <section className="tw-inline-block tw-relative tw-w-full md:tw-w-80 xl:tw-w-96 tw-bg-neutral-500 tw-h-fit tw-rounded-md tw-mb-7">
                    <div className="tw-absolute tw-p-2 tw-px-4 tw-z-10 tw-top-0 tw-bg-neutral-100 tw-w-full tw-bg-opacity-50 tw-bg-blend-soft-light">
                        <Button priority={"secondary"} value={"edit"} extraStyles={"tw-ring-neutral-900"} />
                        <Button priority={"tertiary"} value={"delete"} />
                    </div>
                    <img
                        src={generateRandomImage()}
                        alt="random image from fakerjs"
                        className="tw-relative tw-cursor-pointer tw-w-full tw-object-cover tw-rounded-md tw-shadow-inner tw-shadow-neutral-800"
                    />
                </section>
            </div> */}

            {/**edit image*/}
            {/* <div className="tw-w-screen tw-h-screen tw-absolute tw-top-0 tw-left-0 tw-z-50 tw-bg-neutral-500 tw-bg-opacity-50 tw-flex tw-flex-col tw-items-center tw-justify-center">
                <div className=" tw-bg-neutral-50 tw-drop-shadow-xl tw-shadow-neutral-900 tw-p-4 tw-rounded-md tw-w-11/12 tw-font-Quicksand tw-py-5 md:tw-max-w-md lg:tw-max-w-lg">
                    <CloseIcon
                        backgroundColor={"tw-bg-neutral-50"}
                        shadowColor={"tw-shadow-neutral-50"}
                        fillColor={"tw-fill-neutral-800"}
                        strokeColor={"tw-stroke-neutral-800"}
                        position={"tw-absolute -tw-top-4 -tw-right-2"}
                        onClick={() => {
                            return;
                        }}
                    />
                    <section className="tw-w-36 tw-h-36 tw-rounded-md tw-ring-1 tw-ring-neutral-800">
                        <img
                            src={generateRandomImage()}
                            alt="random image from fakerjs"
                            className="tw-relative tw-w-full tw-h-full tw-object-cover tw-rounded-md tw-shadow-inner tw-shadow-neutral-800"
                        />
                    </section>
                    <TagsInput tags={tags} setTags={setTags} />
                    <TextArea name={"description"} label={"description"} />
                    <Button priority={"secondary"} value={"cancel"} extraStyles={"tw-mr-8"} />
                    <Button priority={"primary"} value={"edit"} />
                </div>
            </div> */}
        </>
    ) : (
        <Outlet />
    );
}

export default Profile;
