"use client";

import AppLoader from "@/components/AppLoader";
import BusinessForm from "@/components/Business/BusinessForm";
import { ErrorMasterComponent } from "@/components/shared/error/ErrorComponent";
import { useSession } from "next-auth/react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { redirect } from "next/navigation";
import { FC } from "react";

interface PageProps {}
const Page: FC<PageProps> = (props) => {
  const session = useSession();

  if (session.status === "loading") return <AppLoader />;

  if (session.status === "unauthenticated") return redirect("/");

  return (
    <ErrorBoundary errorComponent={ErrorMasterComponent}>
      <BusinessForm />
    </ErrorBoundary>
  );
};

export default Page;
