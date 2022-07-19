export {};

declare global {
    namespace Express {
        interface Request {
            user: unknown;
        }
    }
    interface User {
        username: string;
        email: string;
        password: string;
    }
    interface UserSafeProps extends Omit<User, "password"> {
        id: number;
    }
    namespace Server {
        interface responseObj<type> {
            msg: string;
            body?: type;
        }
    }
}
