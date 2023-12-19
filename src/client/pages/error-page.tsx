import { Button, ButtonGroup, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { Link, useRouteError } from "react-router-dom";

interface ErrorProps {
    status: number;
    statusText: string;
    data: string;
}

export default function ErrorPage() {
    const error = useRouteError();

    return (
        <div className="tw-h-screen tw-w-full tw-flex tw-justify-center tw-items-center">
            <div className="tw-flex tw-flex-col tw-items-center tw-gap-2 tw-p-8! tw-relative tw-w-fit!">
                <p>{(error as ErrorProps).status}</p>
                <Heading>{(error as ErrorProps).statusText}</Heading>
                <Text>{(error as ErrorProps).data}</Text>
                <ButtonGroup className="tw-mt-2">
                    <Link to="/">
                        <Button>Go back home</Button>
                    </Link>

                    <Link to="/contact">
                        <Button variant={"ghost"} _hover={""}>
                            Contact support
                        </Button>
                    </Link>
                </ButtonGroup>
            </div>
        </div>
    );
}
