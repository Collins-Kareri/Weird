import { AuthenticatedUserSafeProps } from "@context/user.context";

async function checkAuth(): Promise<{ authStatus: boolean; user: AuthenticatedUserSafeProps | undefined }> {
    const authenticated = await (await fetch("/api/auth", { method: "get" })).json();

    if (authenticated.user) {
        return { authStatus: true, user: authenticated.user };
    }

    return { authStatus: false, user: undefined };
}

export default checkAuth;
