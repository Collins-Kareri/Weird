import React, { useState } from "react";
import Close from "@components/closeButton";
import capitalizeFirstChar from "@clientUtils/capitalizeFirstChar";
import generateKey from "@clientUtils/generateKeys";

export type NotificationDescription = {
    type: "error" | "info" | "success" | "warning";
    msg: string;
};

interface notificationVaryingStyles {
    textColor: string;
    fillColor: string;
    strokeColor: string;
}

interface notificationStateStyleTypes {
    error: notificationVaryingStyles;
    info: notificationVaryingStyles;
    warning: notificationVaryingStyles;
    success: notificationVaryingStyles;
}

type NotificationProps = {
    notifications: NotificationDescription[];
};

/**
 * Takes an array of notifications
 * @param {}
 * @returns JSX.Element
 */
function Notification({ notifications }: NotificationProps) {
    const notificationStateStyles: notificationStateStyleTypes = {
        error: { textColor: "tw-text-error-800", fillColor: "tw-fill-error-800", strokeColor: "tw-stroke-error-800" },
        info: { textColor: "tw-text-normal-800", fillColor: "tw-fill-normal-800", strokeColor: "tw-stroke-normal-800" },
        warning: {
            textColor: "tw-text-warning-800",
            fillColor: "tw-fill-warning-800",
            strokeColor: "tw-stroke-warning-800",
        },
        success: {
            textColor: "tw-text-success-800",
            fillColor: "tw-fill-success-800",
            strokeColor: "tw-stroke-success-800",
        },
    };

    const [currentNotifications, setCurrentNotifications] = useState(notifications);

    function closeNotification(index: number) {
        const filtered: NotificationDescription[] | [] = currentNotifications.filter((_, i) => {
            return i !== index;
        });

        setCurrentNotifications(filtered);

        return;
    }

    return (
        <div className="tw-container tw-inset-x-1/2 -tw-translate-x-2/4 tw-mt-4 tw-absolute tw-w-11/12 tw-z-50 lg:tw-max-w-lg md:tw-w-2/3 main-transition">
            {currentNotifications.map(({ type, msg }, index) => {
                return (
                    <div
                        className={`tw-relative tw-container tw-mx-auto tw-font-Taviraj tw-border tw-border-solid tw-border-primary-100 tw-mb-6 tw-p-4 ${notificationStateStyles[type].textColor} tw-bg-primary-100 tw-shadow-md tw-shadow-primary-700 tw-rounded-lg`}
                        key={generateKey()}
                    >
                        <Close
                            backgroundColor={"tw-bg-primary-100"}
                            shadowColor={"tw-shadow-primary-500"}
                            fillColor={`${notificationStateStyles[type].fillColor}`}
                            strokeColor={`${notificationStateStyles[type].strokeColor}`}
                            onClick={() => {
                                closeNotification(index);
                                return;
                            }}
                        />
                        <h1 className="tw-text-left tw-capitalize tw-font-extrabold">{capitalizeFirstChar(type)}</h1>
                        <p className="tw-font-Quicksand tw-font-semibold">{capitalizeFirstChar(msg)}</p>
                    </div>
                );
            })}
        </div>
    );
}

export default Notification;
