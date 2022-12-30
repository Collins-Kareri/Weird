import React from "react";

interface ToolTipProps extends React.PropsWithChildren {
    msg: string;
}

function Tooltip({ msg, children }: ToolTipProps) {
    return <a title={msg}>{children}</a>;
}

export default Tooltip;
