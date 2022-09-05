import React from "react";
import Button from "./button";
//import { faker } from "@faker-js/faker";
import generateKey from "@src/shared/utils/generateKeys";

interface ImageProps {
    images: { url: string; public_id?: string }[];
}

function ImageBody({ url }: { url: string }) {
    return (
        <section className="tw-inline-block tw-relative tw-w-full md:tw-w-80 xl:tw-w-96 tw-bg-neutral-500 tw-h-fit tw-rounded-md tw-mb-7">
            <div className="tw-absolute tw-p-2 tw-px-4 tw-z-10 tw-top-0 tw-bg-neutral-100 tw-w-full tw-bg-opacity-50 tw-bg-blend-soft-light">
                <Button priority={"tertiary"} value={"remove"} />
            </div>
            <img
                src={url}
                alt="random image from fakerjs"
                className="tw-relative tw-cursor-pointer tw-w-full tw-object-cover tw-rounded-md tw-shadow-inner tw-shadow-neutral-800"
            />
        </section>
    );
}

function Image({ images }: ImageProps) {
    // function generateRandomImage() {
    //     return faker.image.imageUrl();
    // }

    return (
        <div className="tw-container tw-mx-auto tw-p-4 tw-mb-10 tw-columns-1 md:tw-columns-2 lg:tw-columns-3 2xl:tw-columns-4 tw-gap-x-4 tw-w-full">
            {images.map(({ url }) => {
                return <ImageBody url={url} key={generateKey()} />;
            })}
        </div>
    );
}

export default Image;
