import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { LogoTypeFace } from "./Logo";
// import makeRequest from "../utils/makeRequest";
import { faker } from "@faker-js/faker";
// import { Divider } from "@chakra-ui/react";

// interface ImageProps {
//     id: string;
//     author: string;
//     url: string;
//     download_url: string;
// }

export default function Hero() {
    const [backgroundImages, setBackgroundImages] = useState<string[] | [] | undefined>();

    useEffect(() => {
        (async () => {
            try {
                const images = [faker.image.urlLoremFlickr({ height: 960, width: 480 })];
                // const images = await makeRequest("https://picsum.photos/1200/600");
                console.log(images);
                setBackgroundImages(images);
            } catch (error) {
                setBackgroundImages([]);
            }
        })();
    }, []);

    if (!backgroundImages) {
        return <p>....Loading</p>;
    }

    return (
        <div className="tw-h-[80vh] tw-w-full tw-py-4 lg:tw-py-10 tw-relative">
            <section className="tw-flex tw-flex-col tw-items-center tw-h-full tw-justify-center md:tw-justify-center md:tw-items-start tw-relative">
                <section
                    className={
                        "tw-absolute tw-top-1/2 tw-left-1/2 -tw-translate-y-1/2 -tw-translate-x-1/2 tw-rounded-3xl -tw-z-[2] tw-h-3/4 tw-w-screen md:tw-w-1/2 md:tw-left-[80%] lg:tw-w-1/4 lg:tw-h-full tw-opacity-70 tw-ml-10 tw-overflow-clip tw-rounded-r-full lg:tw-z-0 lg:tw-left-[70%] lg:tw-translate-x-0 tw-bg-cover tw-bg-no-repeat tw-bg-center"
                    }
                    style={{ backgroundImage: `url(${backgroundImages[0]})` }}
                ></section>
                <div className="tw-w-full lg:tw-w-[60%] lg:tw-pl-10">
                    <LogoTypeFace className="tw-text-sm" />
                    <h2 className="tw-mb-1 tw-font-sans tw-text-3xl tw-font-bold tw-tracking-tight tw-text-gray-900 sm:tw-text-4xl sm:tw-leading-none">
                        Discover the Unusual.
                    </h2>
                    <span className="tw-inline-block tw-font-sans tw-font-medium tw-text-xl">
                        Dive into a World of Weirdly Captivating Images!
                    </span>
                    <SearchBar className="tw-my-4" size={"lg"} />
                    <ButtonGroup className="tw-flex tw-items-center">
                        <Button>Search</Button>
                        <Button variant={"outline"}>Browse collections</Button>
                    </ButtonGroup>
                </div>
            </section>
            {/* <Divider className="tw-my-8" /> */}
        </div>
    );
}
