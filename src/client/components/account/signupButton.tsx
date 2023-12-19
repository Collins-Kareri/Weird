import { Button, ButtonProps } from "@chakra-ui/react";
import React from "react";

export default function SignupButton(props: ButtonProps) {
    const { px, ...rest } = props;

    return (
        <Button {...rest} px={px ? px : 8}>
            Sign up
        </Button>
    );
}
