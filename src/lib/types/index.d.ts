export {};

declare global {
    interface User {
        username: string;
        email: string;
        password: string;
    }
    interface UserSafeProps extends Omit<User, "password"> {
        id: number;
    }
    interface IconProps {
        backgroundColor: string;
        shadowColor: string;
        fillColor: string;
        strokeColor: string;
        position: string;
        onClick: (evt: React.MouseEvent) => void;
        extraStyle?: string;
    }
}
