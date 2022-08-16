async function checkAuth() {
    const authenticated = await (await fetch("/api/auth", { method: "get" })).json();

    if (authenticated.user) {
        return true;
    }

    return false;
}

export default checkAuth;
