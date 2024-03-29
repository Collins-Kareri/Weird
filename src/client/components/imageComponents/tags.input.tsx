import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import generateKeys from "@src/shared/utils/generateKeys";

interface TagsProps {
    tags: [] | string[];
    setTags: React.Dispatch<React.SetStateAction<[] | string[]>>;
}

function TagsInput({ tags, setTags }: TagsProps) {
    function removeTag(index: number): void {
        setTags(
            tags.filter((_, i) => {
                return i !== index;
            })
        );
        return;
    }

    function handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>): void {
        const el = evt.target as HTMLInputElement;

        if (el.value.length <= 0 && (evt.code.toLowerCase() === "comma" || evt.code.toLowerCase() === "enter")) {
            evt.preventDefault();
            return;
        }

        if (evt.code.toLowerCase() === "enter" || evt.code.toLowerCase() === "comma") {
            evt.preventDefault();
            const value = el.value;
            setTags([...tags, value]);
            el.value = "";
            return;
        }

        return;
    }

    function handleInput(evt: React.FormEvent<HTMLInputElement>) {
        const el = evt.target as HTMLInputElement;
        const evtData = (evt.nativeEvent as InputEvent).data;

        if (el.value.length <= 1 && evtData && evtData === ",") {
            el.value = "";
            return;
        }

        if (evtData && evtData === ",") {
            evt.preventDefault();
            //alert("ya");
            const value = el.value.replace(/,/g, "");
            setTags([...tags, value]);
            el.value = "";
            return;
        }

        return;
    }

    return (
        <>
            <span className="tw-w-full tw-font-Quicksand tw-pl-2  tw-block tw-my-2 tw-text-lg tw-font-semibold ">
                Tags
            </span>
            <div
                data-within="tagsContainer"
                className="tw-max-w-full tw-h-fit tw-bg-neutral-200 tw-p-3.5 tw-rounded-md tw-ring-1 tw-ring-success-700"
            >
                {tags.length > 0 &&
                    tags.map((value, index) => {
                        return (
                            <div
                                data-within="tags"
                                className="tw-inline-flex tw-flex-row tw-items-center tw-bg-neutral-50 tw-w-fit tw-h-fit tw-py-2 tw-px-4 tw-rounded-full tw-ring-1 tw-ring-neutral-900 tw-mr-3 tw-mb-3"
                                key={generateKeys()}
                            >
                                <span
                                    data-within="tagText"
                                    className=" tw-flex
                                    tw-flex-row tw-w-fit
                                     tw-font-Quicksand tw-text-neutral-900"
                                >
                                    {value}
                                </span>
                                <FontAwesomeIcon
                                    icon={"xmark"}
                                    size="lg"
                                    className="tw-pl-2 tw-cursor-pointer"
                                    onClick={() => {
                                        removeTag(index);
                                    }}
                                />
                            </div>
                        );
                    })}
                <input
                    type="text"
                    placeholder="Type tags..."
                    id="tagInput"
                    autoComplete="off"
                    className="tw-border-none tw-p-0 tw-ring-0 focus:tw-ring-0 tw-inline-block tw-bg-neutral-200 tw-text-neutral-900"
                    onKeyDown={handleKeyDown}
                    onInput={handleInput}
                />
            </div>
        </>
    );
}

export default TagsInput;
