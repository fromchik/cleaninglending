import type { PropsWithChildren } from "react";

export function Layout({ children }: PropsWithChildren) {
  return <div className="min-h-screen overflow-x-hidden text-ink">{children}</div>;
}
