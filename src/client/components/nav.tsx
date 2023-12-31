import React from "react";
import Logo from "./Logo";
import {
    ButtonGroup,
    IconButton,
    Menu,
    MenuButton,
    MenuDivider,
    MenuGroup,
    MenuItem,
    MenuList,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import LoginButton from "./account/loginButton";
import SearchBar from "./SearchBar";
import SearchButtonIcon from "./navigation/searchButtonIcon";
import SignupButton from "./account/signupButton";
import { useNavigate } from "react-router-dom";
import { logout } from "./account/logoutButton";

const app_links = [
    {
        to: "/",
        name: "home",
    },
    {
        to: "/upload",
        name: "upload",
    },
    {
        to: "/collections",
        name: "collections",
    },
    {
        to: "/contact",
        name: "contact us",
    },
];

function Nav() {
    const navigate = useNavigate();
    return (
        <nav className="tw-p-4 tw-flex tw-items-center tw-justify-between tw-bg-primary-300 tw-rounded-b-2xl tw-sticky tw-z-50 tw-top-0 tw-left-0">
            <Logo header={true} />

            <div className="tw-flex tw-gap-2 md:tw-flex-[0.4] tw-items-center">
                <SearchBar display={{ base: "none", lg: "block" }} />

                <LoginButton display={{ base: "none", lg: "inline-flex" }} />

                {/* Shows on small screens */}
                <SearchButtonIcon />

                <Menu>
                    <MenuButton>
                        <IconButton icon={<HamburgerIcon />} aria-label="menu" isRound={true} />
                    </MenuButton>
                    <MenuList p={4}>
                        <MenuGroup title="Company">
                            {app_links.map((app_link) => {
                                return (
                                    <MenuItem
                                        className="tw-capitalize"
                                        key={app_link.name}
                                        onClick={() => navigate(app_link.to)}
                                    >
                                        {app_link.name}
                                    </MenuItem>
                                );
                            })}
                        </MenuGroup>

                        <MenuDivider />
                        <MenuGroup title="Profile">
                            <ButtonGroup>
                                <LoginButton />
                                <SignupButton variant={"outline"} />
                            </ButtonGroup>
                            {/* Only show when not logged in */}
                            {/* <MenuItem className="tw-capitalize" onClick={() => navigate("/account")}>
                                my account
                            </MenuItem>
                            <MenuItem className="tw-capitalize" onClick={logout}>
                                logout
                            </MenuItem> */}
                        </MenuGroup>
                    </MenuList>
                </Menu>
            </div>
        </nav>
    );
}

export default Nav;
