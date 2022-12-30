import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import My_Nav from "@components/nav";
import Button from "@components/button";

function Home() {
    const navigate = useNavigate();

    function handleTerms(url: string) {
        return navigate(url);
    }

    function search() {
        const searchEl = document.querySelector("#searchPhotos") as HTMLInputElement;
        const terms = searchEl.value.replace(" ", ",");
        if (terms.length <= 0) {
            return;
        }
        handleTerms(`photos/:${terms}`);
        return;
    }

    function onkeydown(evt: React.KeyboardEvent<HTMLInputElement>) {
        if (evt.key.toLowerCase() === "enter") {
            search();
        }
    }

    return (
        <div className="container">
            <My_Nav />
            <div className="tw-flex tw-h-4/5 tw-w-full tw-justify-center tw-items-center tw-font-extrabold tw-flex-wrap tw-overflow-hidden">
                <section className="tw-w-full tw-flex tw-justify-center tw-flex-col tw-items-center">
                    <div className="tw-w-9/12 lg:tw-w-96 tw-flex tw-justify-center tw-flex-row tw-items-center tw-ring-1 tw-ring-neutral-900 tw-rounded-lg">
                        <FontAwesomeIcon icon={"search"} />
                        <input
                            type={"search"}
                            placeholder={"Search photos"}
                            className={
                                "tw-rounded-lg tw-w-10/12 tw-py-3 tw-border-0 tw-outline-0 tw-ring-0 focus:tw-ring-0 tw-text-primary-800"
                            }
                            id={"searchPhotos"}
                            onKeyDown={onkeydown}
                        />
                    </div>

                    <section className="tw-flex tw-py-4 tw-justify-center tw-items-center">
                        <Button
                            priority={"primary"}
                            value={"Search Photos"}
                            extraStyles={"tw-mr-4"}
                            handleClick={() => {
                                search();
                                return;
                            }}
                        />
                        <p className="tw-mr-4">or</p>
                        <Button
                            priority={"secondary"}
                            value={"Browse Photos"}
                            handleClick={() => {
                                handleTerms("photos/:browse");
                                return;
                            }}
                        />
                    </section>
                </section>
            </div>
        </div>
    );
}

export default Home;
