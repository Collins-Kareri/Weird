import { Button, ButtonProps } from "@chakra-ui/react";
import React from "react";

export default function LoginButton(props: ButtonProps) {
    const { px, ...rest } = props;
    return (
        <Button {...rest} px={px ? px : 8}>
            Log in
        </Button>
    );
}
