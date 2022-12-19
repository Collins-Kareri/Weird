/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import generateKey from "@src/shared/utils/generateKeys";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useQuery } from "react-query";
import { CollectionInfo } from "@pages/profile/edit.Collection";
import { useLocation } from "react-router-dom";
import CollectionImage from "@src/client/components/imageComponents/collection.image";
import UserImage from "@src/client/components/imageComponents/user.image";

export interface ImageProps {
    images?: { url: string; public_id?: string }[];
    collectionName?: string;
    username?: string;
    refetchCollectionImages?: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
    ) => Promise<QueryObserverResult<any, unknown>>;
    setCollectionDetails?: React.Dispatch<React.SetStateAction<CollectionInfo>>;
}

//displays images in a collection or owned by a specific user
function Image({ images, collectionName, refetchCollectionImages, setCollectionDetails, username }: ImageProps) {
    const [skip, setSkip] = useState(0);
    const location = useLocation();

    //fetch images using username or collection name
    const { data, isSuccess, isLoading, refetch } = useQuery(
        "fetchUserImages",
        async () => {
            if (username) {
                return await (await fetch(`/api/image/:${username}?skip=${skip}&&limit=6`, { method: "get" })).json();
            }
            return;
        },
        { refetchInterval: false }
    );

    useEffect(() => {
        if (username && isSuccess && data.Images && data.images.noOfImages && data.images.noOfImages > 6) {
            setSkip(skip + data.images.length);
        }
        return;
    }, [data]);

    return (
        <div
            className="tw-container tw-mx-auto tw-p-4 tw-mb-10 tw-columns-1 md:tw-columns-2 lg:tw-columns-3 2xl:tw-columns-4 tw-gap-x-4 tw-w-full"
            data-within="images"
        >
            {collectionName &&
                images &&
                images.map(({ url, public_id }) => {
                    return (
                        <CollectionImage
                            url={url}
                            public_id={public_id}
                            collectionName={collectionName}
                            refetchCollectionImages={refetchCollectionImages}
                            setCollectionDetails={setCollectionDetails}
                            key={generateKey()}
                        />
                    );
                })}
            {location.pathname === "/profile" &&
                isSuccess &&
                data.images &&
                (data.images as { url: string; public_id: string }[]).map(({ url, public_id }) => {
                    return (
                        <UserImage url={url} public_id={public_id} refetchUserImages={refetch} key={generateKey()} />
                    );
                })}
            {isLoading && <h1>Please wait...</h1>}
        </div>
    );
}

export default Image;
