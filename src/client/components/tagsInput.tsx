import React from "react";
import Close from "@components/closeIcon";
import generateKeys from "@src/lib/utils/generateKeys";

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

        if (el.value.length <= 0) {
            return;
        }

        if (evt.key === "Enter" || evt.key === ",") {
            evt.preventDefault();
            const value = el.value;
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
                                className="tw-inline-flex tw-flex-row tw-items-center tw-bg-neutral-300 tw-w-fit tw-h-fit tw-p-1.5 tw-rounded-xl tw-ring-1 tw-ring-neutral-400 tw-mr-3 tw-mb-3"
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
                                <Close
                                    backgroundColor={"tw-bg-neutral-500"}
                                    shadowColor={"tw-shadow-neutral-500"}
                                    fillColor={"tw-fill-neutral-300"}
                                    strokeColor={"tw-stroke-neutral-300"}
                                    position={"tw-relative"}
                                    extraStyle={"tw-h-7 tw-w-7 tw-ml-1"}
                                    onClick={() => {
                                        removeTag(index);
                                        return;
                                    }}
                                />
                            </div>
                        );
                    })}
                <input
                    type="text"
                    placeholder="Type tags..."
                    id="tagInput"
                    className="tw-border-none tw-p-0 tw-ring-0 focus:tw-ring-0 tw-inline-block tw-bg-neutral-200 tw-text-neutral-500"
                    onKeyDown={handleKeyDown}
                />
            </div>
        </>
    );
}

export default TagsInput;
