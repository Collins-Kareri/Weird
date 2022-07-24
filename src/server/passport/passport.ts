import passport from "passport";
import { Strategy } from "passport-local";
import { login } from "@server/handlers/user.handlers";

const neo4jStrategy = new Strategy({ usernameField: "username", passwordField: "password" }, async function verify(
    username,
    password,
    done
) {
    try {
        const loginResults = await login(username, password);

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
    const currentUser: UserSafeProps = user as UserSafeProps;
    done(null, { id: currentUser.id, username: currentUser.username, email: currentUser.email });
});

passport.deserializeUser((user, done) => {
    done(null, user as UserSafeProps);
});
