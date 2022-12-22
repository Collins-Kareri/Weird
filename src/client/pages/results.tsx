/* eslint-disable prettier/prettier */
import React from "react";
import My_Nav from "@components/nav";
import { useQuery } from "react-query";
import UserIcon from "@components/iconsComponents/userIcon";
import generateKey from "@src/shared/utils/generateKeys";
import { useParams } from "react-router-dom";

interface unsplashResponse {
    alt_description: string;
    urls: {
        raw: string;
        full: string;
        regular: string;
        small: string;
        thumb: string;
        small_s3: string;
    };
    links: {
        self: string;
        html: string;
        download: string;
        download_location: string;
    };
    likes: number;
    user: {
        username: string;
        profile_image: {
            small: string;
            medium: string;
            large: string;
        };
    };
}

function SearchResults() {
    const { term } = useParams();

    const { data, isLoading, isError } = useQuery(
        "fetchSearchedImages",
        async () => {
            let serverRes;
            const parsedTerms = term?.replace(":", "");
            if (parsedTerms === "browse") {
                serverRes = await (await fetch("/api/unsplash/list", { method: "GET" })).json();
            } else {
                serverRes = await (await fetch(`/api/unsplash/search?terms=${parsedTerms}`, { method: "GET" })).json();
            }

            return serverRes.results;
        },
        { refetchInterval: false }
    );

    if (isLoading) {
        return <p>please wait......</p>;
    }

    if (isError) {
        return <p>{"Couldn't fetch images"}</p>;
    }

    if (data && data.length <= 0) {
        return <p>No images match your searched terms</p>;
    }

    return (
        <>
            <My_Nav />
            <div className="tw-w-11/12 tw-columns-1 lg:tw-columns-3 xl:tw-columns-3 md:tw-columns-2 tw-gap-9 tw-container tw-mx-auto tw-mt-10">
                {data &&
                    (data as []).map((val: unsplashResponse) => {
                        return (
                            <div key={generateKey()} className="tw-w-full tw-inline-block tw-mb-6">
                                <img
                                    src={val.urls.regular}
                                    alt={val.alt_description}
                                    className="tw-w-full tw-relative tw-rounded-lg"
                                />
                                <section className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-text-primary-800 tw-font-Quicksand tw-relative">
                                    <div className="tw-flex tw-flex-row tw-items-center tw-absolute tw-z-10 tw-bg-primary-200 tw-w-full tw-bottom-0 tw-rounded-b-lg tw-p-2 tw-bg-opacity-70 tw-bg-blend-hard-light">
                                        {val.user.profile_image && val.user.profile_image.small ? (
                                            <img
                                                src={val.user.profile_image.small}
                                                className="tw-rounded-full tw-mr-1"
                                            />
                                        ) : (
                                            <UserIcon />
                                        )}
                                        <span>{val.user.username}</span>
                                    </div>
                                </section>
                            </div>
                        );
                    })}
            </div>
        </>
    );
}

export default SearchResults;
