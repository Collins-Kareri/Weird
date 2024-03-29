import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import capitalizeFirstChar from "@clientUtils/capitalizeFirstChar";
import generateKey from "@src/shared/utils/generateKeys";
import { useNotification } from "@context/notifications.context";

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

/**
 * Takes an array of notifications */
function Notification() {
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

    // const [currentNotifications, setCurrentNotifications] = useState(notifications);
    const { currentNotifications, removeNotification } = useNotification();

    function closeNotification(index: number) {
        removeNotification(index);
        return;
    }

    return (
        <div className="tw-container tw-inset-x-1/2 -tw-translate-x-1/2 tw-mt-4 tw-absolute tw-w-11/12 tw-z-50 lg:tw-max-w-lg md:tw-w-2/3 main-transition tw-top-4">
            {currentNotifications.map(({ type, msg }, index) => {
                return (
                    <div
                        className={`tw-relative tw-container tw-mx-auto tw-font-Taviraj tw-border tw-border-solid tw-border-neutral-300 tw-mb-6 tw-p-4 ${notificationStateStyles[type].textColor} tw-bg-neutral-50 tw-shadow-md tw-shadow-neutral-300 tw-rounded-lg`}
                        key={generateKey()}
                    >
                        <FontAwesomeIcon
                            icon={"xmark"}
                            onClick={() => {
                                closeNotification(index);
                            }}
                            className={"tw-absolute tw-right-3 tw-top-2 hover:tw-cursor-pointer"}
                            size="lg"
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
