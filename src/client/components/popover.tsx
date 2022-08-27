import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@components/button";

interface ModalProps {
    secondaryAction: boolean;
    message: string;
    secondaryActionValue?: string;
    handlePrimaryAction: () => void;
    primaryActionValue: string;
    handleSecondaryAction?: () => void;
}

const Popover = ({
    secondaryAction,
    handleSecondaryAction,
    secondaryActionValue,
    message,
    handlePrimaryAction,
    primaryActionValue,
}: ModalProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    function cancel(): void {
        if (location.state) {
            navigate((location.state as LocationState).from);
            return;
        }

        navigate("/");
        return;
    }

    return (
        <div
            className="tw-h-fit tw-w-11/12 md:tw-max-w-md tw-absolute tw-top-1/2 tw-left-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2 tw-font-Quicksand tw-bg-neutral-200 tw-py-4 tw-rounded-sm tw-text-neutral-900 tw-drop-shadow-lg"
            id="popover"
        >
            <p className="tw-text-center tw-font-bold tw-text-xl tw-p-4">{message}.</p>
            <div className="tw-flex tw-flex-row tw-justify-center tw-mt-2 tw-w-full tw-border-t-2 tw-border-t-neutral-400">
                {secondaryAction && (
                    <Button
                        priority={"secondary"}
                        value={secondaryActionValue || "cancel"}
                        extraStyles={"tw-mr-4"}
                        handleClick={handleSecondaryAction || cancel}
                    />
                )}
                <Button
                    priority={"primary"}
                    value={primaryActionValue}
                    handleClick={handlePrimaryAction}
                    typeOfButton={"submit"}
                />
            </div>
        </div>
    );
};

export default Popover;
