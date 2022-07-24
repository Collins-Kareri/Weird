import React from "react";
import Link, { LinkPropTypes } from "@components/link";

interface NavPropTypes {
    links: LinkPropTypes[];
}

function Navbar({ links }: NavPropTypes): JSX.Element {
    return <nav>this nav</nav>;
}

export default Navbar;
