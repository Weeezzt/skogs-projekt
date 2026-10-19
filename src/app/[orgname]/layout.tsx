import { Fragment } from "react";

// Remount the page when switching org so client state (loading, filters)
// starts fresh instead of being reset inside effects.
export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgname: string }>;
}) {
  const { orgname } = await params;
  return <Fragment key={orgname}>{children}</Fragment>;
}
