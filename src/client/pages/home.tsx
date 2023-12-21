import React from "react";
import Hero from "../components/hero";
import Gallery from "../components/gallery";
import { Divider } from "@chakra-ui/react";

function Home() {
    return (
        <div className="tw-px-4">
            <Hero />
            <Divider className="tw-my-8" />
            <Gallery />
        </div>
    );
}

export default Home;
