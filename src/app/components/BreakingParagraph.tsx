import React from "react";

export default function BreakingParagraph(
    {children}: {children: React.ReactNode;}
) {
    return (
        <pre>
            <React.Fragment>
                {children}
            </React.Fragment>
        </pre>
    )
}