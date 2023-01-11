import React from "react";

interface ToolTipProps extends React.PropsWithChildren {
    msg: string;
}

function Tooltip({ msg, children }: ToolTipProps) {
    return (
        <a aria-label={msg} title={msg}>
            {children}
        </a>
    );
}

export default Tooltip;
