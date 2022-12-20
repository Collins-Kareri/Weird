import React, { useState } from "react";
import My_Nav from "@components/nav";
import My_Tabs from "@components/tabs";
//import { createApi } from "unsplash-js";

fetch("/api/unsplash/list")
    .then((results) => results.json())
    .then((results) => console.log("results", results))
    .catch((error) => console.log("error", error));

function SearchResults() {
    const [activeTab, setActiveTab] = useState("images");

    return (
        <>
            <My_Nav />
            <My_Tabs
                setActiveTab={setActiveTab}
                activeTab={activeTab}
                tabs={[
                    {
                        information: "images 0",
                        name: "images",
                    },
                ]}
            />
            <div>Content</div>
        </>
    );
}

export default SearchResults;
