import passport from "passport";
import { Strategy } from "passport-local";
import { loginUser } from "@server/handlers/user.handlers";

const neo4jStrategy = new Strategy({ usernameField: "username", passwordField: "password" }, async function verify(
    username,
    password,
    done
) {
    try {
        const loginResults = await loginUser(username, password);

        if (typeof loginResults !== "string") {
            done(null, loginResults);
            return;
        }

        done(loginResults, null, { message: loginResults });
    } catch (error) {
        done(error, null);
    }
});

passport.use(neo4jStrategy);

passport.serializeUser((user, done) => {
    done(null, user as UserSafeProps);
});

passport.deserializeUser((user, done) => {
    done(null, user as UserSafeProps);
});
