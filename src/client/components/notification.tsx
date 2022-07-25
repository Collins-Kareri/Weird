import React from "react";
import Close from "@components/closeButton";
import capitalizeFirstChar from "@clientUtils/capitalizeFirstChar";
import { v4 as uuidv4 } from "uuid";

const myuuid = uuidv4();

interface TypeOfNotication {
    notificationType: "error" | "info" | "success" | "warning";
    msg: string;
}

interface notificationStateStyleTypes {
    error: string;
    info: string;
    warning: string;
    success: string;
}

interface NotificationPropTypes {
    notifications: TypeOfNotication[];
}

function Notification({ notifications }: NotificationPropTypes) {
    const notificationStateStyles: notificationStateStyleTypes = {
        error: "error-800",
        info: "normal-800",
        warning: "warning-800",
        success: "success-800",
    };

    return (
        <div className="tw-container tw-inset-x-1/2 -tw-translate-x-2/4 tw-mt-4 tw-absolute tw-w-11/12 tw-z-50 lg:tw-max-w-lg md:tw-w-2/3">
            {notifications.map(({ notificationType, msg }) => {
                return (
                    <div
                        className={`tw-relative tw-container tw-mx-auto tw-font-Taviraj tw-border tw-border-solid tw-border-primary-100 tw-mb-6 tw-p-4 tw-text-${notificationStateStyles[notificationType]} tw-bg-primary-100 tw-shadow-md tw-shadow-primary-700 tw-rounded-lg`}
                        key={myuuid}
                    >
                        <Close
                            backgroundColor={"tw-bg-primary-100"}
                            shadowColor={"tw-shadow-primary-500"}
                            fillColor={`tw-fill-${notificationStateStyles[notificationType]}`}
                            strokeColor={`tw-stroke-${notificationStateStyles[notificationType]}`}
                        />
                        <h1 className="tw-text-left tw-capitalize tw-font-extrabold">{notificationType}</h1>
                        <p className="tw-font-Quicksand tw-font-semibold">{capitalizeFirstChar(msg)}</p>
                    </div>
                );
            })}
        </div>
    );
}

export default Notification;
