/* eslint-disable prettier/prettier */
import React from "react";
import My_Nav from "@components/nav";
import { useQuery } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from "@components/tooltip";
import Masonary from "@components/my_layouts/masonary";
import generateKey from "@src/shared/utils/generateKeys";
import { useParams } from "react-router-dom";

interface ImageProps {
    user: {
        profilePic?: string;
        name: string;
    };
    url: string;
    public_id: string;
    alt_description: string;
}

function SearchResults() {
    const { term } = useParams();

    const { backgroundColor, shadowColor } = {
        backgroundColor: "tw-bg-primary-200",
        shadowColor: "tw-shadow-primary-500",
    };

    const { data, isLoading, isError } = useQuery(
        "fetchSearchedImages",
        async () => {
            let server_results;
            const parsedTerms = term?.replace(":", "");
            if (parsedTerms === "browse") {
                const serverRes = await(await fetch("/api/image/?skip=0&limit=6", { method: "GET" })).json();
                server_results = serverRes.images;
            } else {
                const serverRes = await(
                    await fetch(`/api/unsplash/search?terms=${parsedTerms}`, { method: "GET" })
                ).json();
                const { results } = serverRes.results;
                server_results = results;
            }

            return server_results;
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
            <Masonary>
                {data &&
                    (data as ImageProps[]).map((val) => {
                        return (
                            <div key={generateKey()} className="tw-w-full tw-inline-block tw-mb-6">
                                <img
                                    src={val.url}
                                    alt={val.alt_description}
                                    className="tw-w-full tw-relative tw-rounded-lg"
                                />
                                <section className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-text-primary-800 tw-font-Quicksand tw-relative">
                                    <div className="tw-flex tw-flex-row tw-items-center tw-absolute tw-z-10 tw-bg-primary-200 tw-w-full tw-bottom-0 tw-rounded-b-lg tw-p-2 tw-bg-opacity-70 tw-bg-blend-hard-light tw-justify-between">
                                        <section className="tw-flex tw-flex-row tw-items-center tw-w-fit">
                                            {val.user.profilePic ? (
                                                <img
                                                    src={val.user.profilePic}
                                                    className="tw-rounded-md tw-mr-2 tw-w-8 tw-h-8 tw-object-fill"
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={"user-large"}
                                                    className={`tw-shadow-inner tw-mr-2 ${shadowColor} ${backgroundColor} tw-p-3 tw-rounded-md`}
                                                    size="lg"
                                                />
                                            )}
                                            <a
                                                href={`/user/:${val.user.name}`}
                                                className="tw-text-primary-800 tw-font-bold"
                                            >
                                                {val.user.name}
                                            </a>
                                        </section>
                                        <section className="tw-flex tw-flex-row tw-items-center tw-w-fit">
                                            <Tooltip msg="Add to image collection.">
                                                <FontAwesomeIcon
                                                    icon={"plus"}
                                                    className={`tw-text-center tw-shadow-inner tw-mr-2 tw-cursor-pointer ${shadowColor} ${backgroundColor} tw-p-3 tw-rounded-md`}
                                                    size="lg"
                                                />
                                            </Tooltip>
                                            <Tooltip msg="Like image.">
                                                <FontAwesomeIcon
                                                    icon={"heart"}
                                                    className={`tw-shadow-inner tw-mr-2 tw-cursor-pointer ${shadowColor} ${backgroundColor} tw-p-3 tw-rounded-md`}
                                                    size="lg"
                                                />
                                            </Tooltip>
                                            <Tooltip msg="Download image.">
                                                <FontAwesomeIcon
                                                    icon={"download"}
                                                    className={`tw-shadow-inner tw-text-center tw-cursor-pointer ${shadowColor} ${backgroundColor} tw-p-3 tw-rounded-md`}
                                                    size="lg"
                                                />
                                            </Tooltip>
                                        </section>
                                    </div>
                                </section>
                            </div>
                        );
                    })}
            </Masonary>
        </>
    );
}

export default SearchResults;
