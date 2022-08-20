import React from "react";
import Button from "@components/button";
import Input from "@components/inputField";
import Logo from "@assets/logo.svg";
import EditIcon from "@assets/edit.svg";
import CloseIcon from "@components/closeIcon";

function Profile() {
    const tabStyles = {
        active: "tw-underline tw-underline-offset-8 hover:tw-underline-offset-4",
        inactive: "tw-font-medium  hover:tw-font-semibold hover:tw-underline hover:tw-underline-offset-8",
    };

    const placeholderContent = {
        images: {
            msg: "Publish your first image. Be part of the community",
            callToAction: "publish",
        },
        collections: {
            msg: "Curate your images by topic.",
            callToAction: "create",
        },
    };

    return (
        <>
            <div className=" tw-flex tw-flex-col tw-justify-center tw-items-center  tw-font-Quicksand tw-font-semibold tw-p-4 tw-text-neutral-800 md:tw-flex-row">
                {/**profile image placeholder */}
                <section className="tw-relative tw-mb-4 md:tw-mx-4 tw-flex tw-flex-col tw-items-center tw-justify-center">
                    <span className="tw-bg-neutral-300 tw-rounded-full tw-inline-block tw-w-20 tw-h-20 md:tw-w-28 md:tw-h-28"></span>

                    {/**edit profie pic icon*/}
                    <div className="tw-absolute tw-bottom-0 tw-right-0 tw-w-8 tw-h-8 tw-bg-neutral-800 tw-rounded-full tw-flex tw-flex-row tw-justify-center tw-items-center tw-cursor-pointer md:tw-h-9 md:tw-w-9 tw-ring tw-ring-neutral-800 tw-border-0 hover:tw-ring-offset-1 hover:tw-ring-offset-neutral-800 main-transition">
                        <img src={EditIcon as string} alt="edit icon" className="tw-w-9/12" />
                    </div>
                </section>

                <section className="tw-flex tw-flex-col tw-items-center tw-justify-center">
                    <span className="tw-text-lg">username</span>
                    <span className="tw-text-lg">email@mail.com</span>
                    <Button priority={"primary"} value={"edit profile"} />
                </section>
            </div>

            {/**tabs */}
            <div className="tw-flex tw-flex-row tw-justify-start tw-font-Quicksand tw-font-bold tw-text-lg tw-text-neutral-800 tw-p-2 lg:tw-p-4">
                <span className={`tw-p-2 tw-cursor-pointer ${tabStyles.inactive} main-transition`}>images 0</span>

                <span className={`tw-p-2 tw-cursor-pointer ${tabStyles.active} main-transition`}>collections 0</span>
            </div>

            {/**placeholder */}
            <div className="tw-flex tw-flex-col tw-w-fit tw-mx-auto tw-justify-center tw-items-center tw-mb-11">
                <img src={Logo as string} alt="app logo" className="tw-relative tw-w-8/12" />
                <span className="tw-font-Quicksand tw-font-medium">{placeholderContent.collections.msg}</span>
                <Button priority={"secondary"} value={placeholderContent.collections.callToAction} />
            </div>

            <div className="tw-w-screen tw-h-screen tw-absolute tw-top-0 tw-left-0 tw-z-50 tw-bg-neutral-500 tw-bg-opacity-50 tw-flex tw-flex-col tw-items-center tw-justify-center">
                <div className=" tw-bg-neutral-50 tw-drop-shadow-xl tw-shadow-neutral-900 tw-p-4 tw-rounded-md tw-w-11/12 tw-font-Quicksand tw-py-5 md:tw-max-w-md lg:tw-max-w-lg">
                    <CloseIcon
                        backgroundColor={"tw-bg-neutral-200"}
                        shadowColor={"tw-shadow-neutral-200"}
                        fillColor={"tw-fill-neutral-800"}
                        strokeColor={"tw-stroke-neutral-800"}
                        position={"tw-absolute -tw-top-4 -tw-right-2"}
                        onClick={() => {
                            return;
                        }}
                    />
                    <Input
                        type={"text"}
                        label={"collection name"}
                        placeholder={"collection name"}
                        name={"collection"}
                        handleChange={() => {
                            return;
                        }}
                    />
                    <label className="tw-p-2 tw-inline-block tw-text-lg tw-font-medium" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        className="tw-w-full tw-rounded-md tw-border-0 tw-outline-0 tw-ring-1 tw-ring-success-800 tw-bg-neutral-200"
                        placeholder="description"
                        name="description"
                    ></textarea>
                    <Button priority={"secondary"} value={"cancel"} extraStyles={"tw-mr-8"} />
                    <Button priority={"primary"} value={"create"} />
                </div>
            </div>
        </>
    );
}

export default Profile;
