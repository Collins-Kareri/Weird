import { SearchIcon } from "@chakra-ui/icons";
import {
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalFooter,
    Button,
    useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import SearchBar from "../SearchBar";

export default function SearchButtonIcon() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <IconButton
                icon={<SearchIcon />}
                aria-label="search"
                isRound={true}
                onClick={onOpen}
                display={{ base: "block", lg: "none" }}
            />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent marginX={3} paddingX={2}>
                    <ModalHeader>Search Images</ModalHeader>
                    <ModalCloseButton />
                    <SearchBar />
                    <ModalFooter className="tw-flex tw-gap-2">
                        <Button variant={"ghost"} onClick={onClose}>
                            Close
                        </Button>
                        <Button>Search</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
