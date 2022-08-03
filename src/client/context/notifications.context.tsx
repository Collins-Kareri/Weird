import { createContext } from "react";
import { NotificationDescription } from "@components/notification";

interface ContextProps {
    currentNotifications: NotificationDescription[] | [];
    setCurrentNotifications: React.Dispatch<React.SetStateAction<NotificationDescription[] | []>>;
}

const notificationContext = createContext<ContextProps>({
    currentNotifications: [],
    setCurrentNotifications: () => {
        return;
    },
});

export default notificationContext;
