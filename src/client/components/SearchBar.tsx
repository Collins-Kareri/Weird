import { SearchIcon } from "@chakra-ui/icons";
import { InputGroup, InputLeftElement, Input, InputGroupProps, InputProps } from "@chakra-ui/react";
import React from "react";

interface SearchBarProps extends InputGroupProps {
    size?: InputProps["size"];
}

export default function SearchBar(props: SearchBarProps) {
    const { size, ...rest } = props;
    return (
        <InputGroup {...rest}>
            <InputLeftElement pointerEvents={"none"} className={size ? "!tw-top-[3px] !tw-left-[3px]" : ""}>
                <SearchIcon boxSize={5} />
            </InputLeftElement>

            <Input placeholder="search images" variant={"filled"} borderRadius={"lg"} type="text" size={size} />
        </InputGroup>
    );
}
