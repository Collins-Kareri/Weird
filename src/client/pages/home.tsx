import React from "react";
import My_Nav from "@components/nav";
import Button from "@components/button";
import Search from "@components/iconsComponents/searchIcon";

function Home() {
    return (
        <div className="container">
            <My_Nav />
            <div className="tw-flex tw-h-4/5 tw-w-full tw-justify-center tw-items-center tw-font-extrabold tw-flex-wrap tw-overflow-hidden">
                <section className="tw-w-full tw-flex tw-justify-center tw-flex-col tw-items-center">
                    <div className="tw-w-9/12 lg:tw-w-96 tw-flex tw-justify-center tw-flex-row tw-items-center tw-ring-1 tw-ring-neutral-900 tw-rounded-lg">
                        <Search fillColor={""} strokeColor={""} />
                        <input
                            type={"search"}
                            placeholder={"Search photos"}
                            className={
                                "tw-rounded-lg tw-w-10/12 tw-py-3 tw-border-0 tw-outline-0 tw-ring-0 focus:tw-ring-0"
                            }
                        />
                    </div>
                    <p className="tw-my-4">or</p>
                    <section className="tw-flex tw-py-4 tw-justify-center">
                        <Button priority={"primary"} value={"Browse Photos"} extraStyles={"tw-mr-4"} />
                        <Button priority={"secondary"} value={"Trending"} />
                    </section>
                </section>
            </div>
        </div>
    );
}

export default Home;
