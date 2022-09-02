import passport from "passport";
import { Strategy } from "passport-local";
import { loginUser } from "@server/handlers/user.handlers";

function parseUser(user: UserSafeProps) {
    const { public_id, url, ...others } = user;

    let parsedUser;

    if (public_id && url) {
        parsedUser = { profilePic: { public_id, url }, ...others };
    } else {
        parsedUser = others;
    }

    return parsedUser;
}

const neo4jStrategy = new Strategy({ usernameField: "username", passwordField: "password" }, async function verify(
    username,
    password,
    done
) {
    try {
        const loginResults = await loginUser(username, password);

        if (typeof loginResults !== "string") {
            done(null, parseUser(loginResults as UserSafeProps));
            return;
        }

        done(loginResults, null, { message: loginResults });
    } catch (error) {
        done(error, null);
    }
});

passport.use(neo4jStrategy);

passport.serializeUser((user, done) => {
    done(null, parseUser(user as UserSafeProps));
});

passport.deserializeUser((user, done) => {
    done(null, parseUser(user as UserSafeProps));
});
