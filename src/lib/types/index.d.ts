export {};

declare global {
    interface User {
        username: string;
        email: string;
        password: string;
    }

    interface UserSafeProps extends Omit<User, "password"> {
        id: string;
        profilePicPublicId?: string;
        profilePicUrl?: string;
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

    interface google_tagging_data {
        tag: string;
        confidence: number;
    }

    interface CloudinaryRes {
        asset_id: string;
        public_id: string;
        version: number;
        version_id: string;
        signature: string;
        width: number;
        height: number;
        format: string;
        resource_type: string;
        created_at: string;
        tags: string[];
        pages: number;
        bytes: number;
        type: string;
        etag: string;
        placeholder: boolean;
        url: string;
        secure_url: string;
        access_mode: string;
        context: {
            custom: {
                alt: string;
            };
        };
        info: {
            categorization: {
                google_tagging: {
                    status: string;
                    data: google_tagging_data[];
                };
            };
        };
        colors: [string, number];
        predominant: {
            google: [string, number];
            cloudinary: [string, number];
        };
        delete_token: string;
    }

    interface LocationState {
        path: string;
        from: string;
    }
}
