import React, { createContext, useContext, useState } from "react";

export interface AuthenticatedUserSafeProps {
    id: string;
    username: string;
    email: string;
    profilePic?: {
        url: string;
        public_id: string;
    };
    noOfUploadedImages: number;
    noOfCollections: number;
}

interface UserContext {
    currentUser: AuthenticatedUserSafeProps | undefined;
    setUser: (user: AuthenticatedUserSafeProps | undefined) => void;
}

interface UserProps {
    children: React.ReactNode;
}

const UserContext = createContext<UserContext>({
    currentUser: undefined,
    setUser: () => {
        return;
    },
});

export const UserProvider = ({ children }: UserProps) => {
    const [currentUser, setCurrentUser] = useState<AuthenticatedUserSafeProps | undefined>(undefined);

    const setUser = (user: AuthenticatedUserSafeProps | undefined) => {
        setCurrentUser(user);
    };

    return <UserContext.Provider value={{ currentUser, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    return useContext(UserContext);
};

export const UserConsumer = ({ children }: UserProps) => {
    return <UserContext.Consumer>{(currentUser) => currentUser && children}</UserContext.Consumer>;
};
