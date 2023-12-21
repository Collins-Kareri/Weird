import React from "react";
import SearchBar from "./SearchBar";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { LogoTypeFace } from "./Logo";

export default function Hero() {
    return (
        <div className="tw-relative tw-flex tw-flex-col-reverse tw-py-16 lg:tw-pt-0 lg:tw-flex-col lg:tw-pb-0">
            <div className="tw-inset-y-0 tw-top-0 tw-right-0 tw-z-0 tw-w-full tw-max-w-xl tw-px-4 tw-mx-auto md:tw-px-0 lg:tw-pr-0 lg:tw-mb-0 lg:tw-mx-0 lg:tw-w-7/12 lg:tw-max-w-full lg:tw-absolute xl:tw-px-0">
                <img
                    className="tw-object-cover tw-w-full tw-h-56 tw-rounded tw-shadow-lg lg:tw-rounded-lg lg:tw-shadow-none md:tw-h-96 lg:tw-h-full tw-opacity-80"
                    src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
                    alt=""
                />
                <p className="tw-text-right tw-bottom-2 tw-absolute tw-right-2 tw-hidden lg:tw-block">by username</p>
            </div>
            <div className="tw-relative tw-flex tw-flex-col tw-items-start tw-w-full tw-max-w-xl tw-px-4 tw-mx-auto tw-md:px-0 lg:tw-px-8 lg:tw-max-w-screen-xl">
                <div className="tw-mb-16 lg:tw-my-40 lg:tw-max-w-lg lg:tw-pr-5">
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
            </div>
        </div>
    );
}
