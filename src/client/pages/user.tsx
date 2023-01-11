import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import Masonary from "@components/my_layouts/masonary";
import { My_Grid } from "@components/collections/collections.currentUser";
import My_Nav from "@components/nav";
import Tooltip from "@components/tooltip";
import My_Tabs from "@components/tabs";
import Logo from "@assets/logo.svg";
import generateKey from "@src/shared/utils/generateKeys";

interface ImageActionsProps {
    msg: string;
    action: () => void;
    icon: FontAwesomeIconProps["icon"];
}

interface UserImageProps extends React.PropsWithChildren {
    src: string;
    alt_description: string;
}

interface ImageProps {
    user: {
        profilePic: string;
        name: string;
    };
    url: string;
    public_id: string;
}

// interface CollectionProps {
//     name: string;
//     description: string;
//     coverImage: string;
//     noOfItems: number;
// }

interface UserProps {
    profilePic?: {
        url: string;
    };
    id: string;
    email: string;
    username: string;
    noOfCollections: number;
    noOfUploadedImages: number;
}

interface UserProfilePicProps {
    src?: string;
}

interface ProfilePicProps extends React.PropsWithChildren {
    src: string;
}

function UserProfilePic({ src }: UserProfilePicProps) {
    return (
        <section className="tw-rounded-full tw-w-8 tw-h-8 tw-relative tw-shadow-inner tw-shadow-primary-500 tw-bg-primary-200 tw-flex tw-flex-col tw-justify-center tw-items-center tw-text-primary-900">
            {src ? (
                <img src={src} className="tw-object-fill tw-w-full tw-h-full tw-rounded-full" />
            ) : (
                <FontAwesomeIcon icon={"user-large"} />
            )}
        </section>
    );
}

function PlaceholderContent({ children }: React.PropsWithChildren) {
    return (
        <section className="tw-w-full tw-flex tw-flex-col tw-items-center">
            <img src={Logo as string} alt="app logo" className="tw-relative tw-w-40" />
            {children}
        </section>
    );
}

function ImageControls({ msg, action, icon }: ImageActionsProps) {
    return (
        <Tooltip msg={msg}>
            <FontAwesomeIcon
                icon={icon}
                className={
                    "tw-text-center tw-shadow-inner tw-mr-2 tw-cursor-pointer tw-p-3 tw-rounded-md tw-bg-primary-200 tw-shadow-primary-500"
                }
                size="lg"
                onClick={action}
            />
        </Tooltip>
    );
}

export function ImageDetailsAndControls({ profile_image, username }: { profile_image: string; username: string }) {
    return (
        <>
            <section className="tw-flex tw-flex-row tw-items-center tw-w-fit">
                <UserProfilePic src={profile_image} />
                <a href={`/user/:${username}`} className="tw-ml-2">
                    {username}
                </a>
            </section>
            <section className="tw-flex tw-flex-row tw-items-center tw-w-fit">
                <ImageControls
                    msg="Add to collection"
                    icon={"plus"}
                    action={() => {
                        return;
                    }}
                />
                <ImageControls
                    msg="Like image"
                    icon={"heart"}
                    action={() => {
                        return;
                    }}
                />
                <ImageControls
                    msg="Download image"
                    icon={"download"}
                    action={() => {
                        return;
                    }}
                />
            </section>
        </>
    );
}

export function UserImage({ src, alt_description, children }: UserImageProps) {
    return (
        <div className="tw-w-full tw-inline-block tw-mb-6 tw-relative">
            <img src={src} alt={alt_description} className="tw-w-full tw-relative tw-rounded-lg" />

            <div className="tw-flex tw-flex-row tw-items-center tw-absolute tw-z-10 tw-bg-primary-200 tw-text-primary-800  tw-w-full tw-bottom-0 tw-rounded-b-lg tw-p-2 tw-bg-opacity-70 tw-bg-blend-hard-light tw-justify-between">
                {children}
            </div>
        </div>
    );
}

export function ProfilePic({ src, children }: ProfilePicProps) {
    return (
        <div className="tw-relative">
            {src ? (
                <img
                    src={src}
                    alt="user profile pic"
                    className="tw-rounded-full tw-shadow-inner tw-shadow-primary-200 tw-w-28 tw-h-28 tw-object-cover tw-text-primary-700"
                />
            ) : (
                <FontAwesomeIcon
                    icon={"user-large"}
                    className="tw-rounded-full tw-bg-primary-200 tw-shadow-inner tw-shadow-primary-200 tw-p-8 tw-w-20 tw-h-20 tw-text-primary-700"
                    size="lg"
                />
            )}
            {children}
        </div>
    );
}

export function ProfileDetails({
    username,
    email,
    children,
}: React.PropsWithChildren<{ username: string; email: string }>) {
    return (
        <>
            <section className="tw-text-center tw-text-primary-700 tw-mt-3">
                <h1 className="tw-text-2xl tw-capitalize  tw-font-bold">{username}</h1>
                <p>{email}</p>
                {children}
            </section>
        </>
    );
}

export function ProfileBody({ children }: React.PropsWithChildren) {
    return (
        <div className="tw-container tw-mx-auto">
            <section className="tw-w-full tw-mt-7 tw-flex tw-flex-col tw-items-center"> {children}</section>
        </div>
    );
}

function User() {
    const [activeTab, setActiveTab] = useState("images");
    const { username } = useParams();
    const [userData, setUserData] = useState<null | UserProps>(null);

    const { data, isSuccess } = useQuery(
        ["fetchUserMedia", activeTab, userData],
        async () => {
            let results;
            if (activeTab === "images" && userData && userData?.noOfUploadedImages > 0) {
                results = await (await fetch(`/api/image/${username}?skip=0&limit=6`)).json();
                return results.images;
            } else if (activeTab === "collections" && userData && userData.noOfCollections > 0) {
                results = await (await fetch(`/api/collection/${username}?skip=0&limit=6`)).json();
                return results.collections;
            } else {
                return [];
            }
        },
        { refetchInterval: false }
    );

    useEffect(() => {
        if (!userData) {
            (async () => {
                const results = await (await fetch(`/api/user/${username}`, { method: "get" })).json();
                setUserData(results.user);
                return;
            })();
        }

        return;
    }, []);

    if (!userData) {
        return <p>Please wait!</p>;
    }

    return (
        <>
            <My_Nav />
            <ProfileBody>
                {userData.profilePic && <ProfilePic src={userData.profilePic.url} />}

                <ProfileDetails email={userData.email} username={userData.username} />

                <My_Tabs
                    setActiveTab={setActiveTab}
                    activeTab={activeTab}
                    tabs={[
                        {
                            information: `images ${userData.noOfUploadedImages}`,
                            name: "images",
                        },
                        {
                            information: `collections ${userData.noOfCollections}`,
                            name: "collections",
                        },
                    ]}
                />

                <section className="tw-w-full tw-flex tw-flex-col tw-items-center">
                    {userData.noOfUploadedImages === 0 && activeTab === "images" && (
                        <PlaceholderContent>
                            <p>{"no images"}</p>
                        </PlaceholderContent>
                    )}

                    {userData && userData.noOfUploadedImages > 0 && activeTab === "images" && isSuccess && (
                        <Masonary>
                            {data.map((val: ImageProps) => {
                                return (
                                    <UserImage src={val.url} key={generateKey()} alt_description={""}>
                                        <ImageDetailsAndControls
                                            profile_image={val.user.profilePic}
                                            username={val.user.name}
                                        />
                                    </UserImage>
                                );
                            })}
                        </Masonary>
                    )}

                    {userData.noOfCollections === 0 && activeTab === "collections" && (
                        <PlaceholderContent>
                            <p>{"no collections"}</p>
                        </PlaceholderContent>
                    )}

                    {userData.noOfCollections > 0 && activeTab === "collections" && <My_Grid>{"data"}</My_Grid>}
                </section>
            </ProfileBody>
        </>
    );
}

export default User;
