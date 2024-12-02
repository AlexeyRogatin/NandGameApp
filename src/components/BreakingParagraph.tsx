import React from "react";

export default function BreakingParagraph({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <pre>
      <code>{children}</code>
    </pre>
  );
}
