import { Button, ButtonProps } from "@chakra-ui/react";
import React from "react";

export function logout() {
    // logout logic will be placed here
}

export default function LogoutButton(props: ButtonProps) {
    const { px, ...rest } = props;

    return (
        <Button {...rest} px={px ? px : 8} onClick={logout}>
            logout
        </Button>
    );
}
