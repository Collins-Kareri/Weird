import { SearchIcon } from "@chakra-ui/icons";
import { InputGroup, InputLeftElement, Input, InputGroupProps } from "@chakra-ui/react";
import React from "react";

export default function SearchBar(props: InputGroupProps) {
    return (
        <InputGroup {...props}>
            <InputLeftElement pointerEvents={"none"}>
                <SearchIcon boxSize={5} />
            </InputLeftElement>
            <Input placeholder="search images" variant={"filled"} borderRadius={"lg"} />
        </InputGroup>
    );
}
