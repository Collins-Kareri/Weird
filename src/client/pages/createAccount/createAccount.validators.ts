interface ErrorDispatchActions {
    type: string;
    payload?: string;
}

export function isValidEmail(el: HTMLInputElement, dispatch: React.Dispatch<ErrorDispatchActions>): void {
    let msg: string | undefined;

    if (el.type === "email" && el.value.length === 1) {
        msg = `${name} is not valid`;
        dispatch({ type: "email", payload: msg });
        el.setCustomValidity(msg);
        return;
    }

    if (el.validity.typeMismatch) {
        dispatch({ type: "email", payload: "email is not valid" });
        return;
    }

    el.setCustomValidity("");
    return;
}

export function isValidUsername(el: HTMLInputElement, dispatch: React.Dispatch<ErrorDispatchActions>): void {
    let msg: string | undefined;

    const validUserNameRegex = /^[^\W][0-9a-z._]+[^\W_]+$/i;

    if (el.value.length < 3) {
        msg = "username cannot be less than 3 characters";
        dispatch({ type: "username", payload: msg });
        el.setCustomValidity(msg);
        return;
    }

    if (validUserNameRegex.test(el.value)) {
        el.setCustomValidity("");
        return;
    }

    msg = "username cannot start or end with special characters. Only allow letters,numbers,comma and underscore";
    dispatch({ type: "username", payload: msg });
    el.setCustomValidity(msg);
    return;
}

export function passwordsMatch(
    compareVal: HTMLInputElement,
    confirmPassword: HTMLInputElement,
    dispatch: React.Dispatch<ErrorDispatchActions>
): void {
    const msg = "passwords don't match";
    if (compareVal && confirmPassword) {
        if (
            confirmPassword.value.length > 0 &&
            compareVal.value.toLowerCase() !== confirmPassword.value.toLowerCase()
        ) {
            confirmPassword.setCustomValidity(msg);
            dispatch({ type: "confirm_password", payload: msg });
        } else {
            confirmPassword.setCustomValidity("");
        }
    }
}

/**
 * check if the username or email exists in database. In the first step of the form
 * @param val
 * @returns boolean
 */
export async function checkIfCredentialExist(val: string): Promise<boolean> {
    const results = await (await fetch(`/api/user/:${val}`, { method: "get" })).json();

    if (results.msg === "found") {
        return true;
    }

    return false;
}
