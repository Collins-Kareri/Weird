import React, { createContext, useContext, useState, useEffect } from "react";
import { NotificationDescription } from "@components/notification";

interface NotificationContext {
    currentNotifications: NotificationDescription[] | [];
    addNotification: (notification: NotificationDescription) => void;
    removeNotification: (index: number) => void;
}

interface NotificationProps {
    children: React.ReactNode;
}

const NotificationContext = createContext<NotificationContext>({
    currentNotifications: [],
    addNotification: () => {
        return;
    },
    removeNotification: () => {
        return;
    },
});

export const NotificationProvider = ({ children }: NotificationProps) => {
    const [currentNotifications, setCurrentNotifications] = useState<NotificationDescription[] | []>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (currentNotifications.length > 0) {
                removeNotification(0);
            }
        }, 4000);

        return clearInterval(interval);
    }, [currentNotifications]);
    const removeNotification = (index: number) => {
        setCurrentNotifications(
            currentNotifications.filter((_, i) => {
                return i !== index;
            })
        );
    };

    const addNotification = (notification: NotificationDescription) => {
        setCurrentNotifications([...currentNotifications, notification]);
        setTimeout(() => {
            removeNotification(0);
        }, 2000);
    };

    return (
        <NotificationContext.Provider value={{ currentNotifications, addNotification, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    return useContext(NotificationContext);
};

export const NotificationConsumer = ({ children }: NotificationProps) => {
    return (
        <NotificationContext.Consumer>
            {(notifications) => notifications.currentNotifications.length > 0 && children}
        </NotificationContext.Consumer>
    );
};
