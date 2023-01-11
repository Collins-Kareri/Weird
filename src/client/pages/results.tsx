/* eslint-disable prettier/prettier */
import React from "react";
import My_Nav from "@components/nav";
import { useQuery } from "react-query";
import Masonary from "@components/my_layouts/masonary";
import generateKey from "@src/shared/utils/generateKeys";
import { useParams } from "react-router-dom";
import { UserImage, ImageDetailsAndControls } from "@pages/user";

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

    const { data, isLoading, isError } = useQuery(
        "fetchSearchedImages",
        async () => {
            let server_results;
            const parsedTerms = term?.replace(":", "");
            if (parsedTerms === "browse") {
                const serverRes = await (await fetch("/api/image/?skip=0&limit=6", { method: "GET" })).json();
                server_results = serverRes.images;
            } else {
                const serverRes = await (
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
                            <UserImage src={val.url} alt_description={val.alt_description} key={generateKey()}>
                                <ImageDetailsAndControls
                                    profile_image={val.user.profilePic || ""}
                                    username={val.user.name}
                                />
                            </UserImage>
                        );
                    })}
            </Masonary>
        </>
    );
}

export default SearchResults;
