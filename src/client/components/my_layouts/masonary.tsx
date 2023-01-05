import React from "react";

function Masonary({ children }: React.PropsWithChildren) {
    return (
        <div className="tw-w-11/12 tw-columns-1 lg:tw-columns-3 xl:tw-columns-3 md:tw-columns-2 tw-gap-9 tw-container tw-mx-auto tw-mt-10">
            {children}
        </div>
    );
}

export default Masonary;
