import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

interface MyLinkProps {
    navigateTo: string;
    name: string;
    replaceHistory: boolean;
}

function MyLink({ navigateTo, name, replaceHistory }: MyLinkProps) {
    const navigate = useNavigate();
    const location = useLocation();

    function onclick(navigateTo: string, replaceHistory: boolean): undefined {
        navigate(navigateTo, { state: { from: location.pathname }, replace: replaceHistory });
        return;
    }

    return (
        <Link
            className="tw-text-neutral-700 tw-font-Quicksand tw-uppercase tw-mr-4 hover:tw-text-neutral-900"
            to={navigateTo}
            onClick={() => {
                onclick(navigateTo, replaceHistory);
            }}
        >
            {name}
        </Link>
    );
}

export default MyLink;
