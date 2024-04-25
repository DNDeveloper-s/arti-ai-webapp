"use client";

import AppLoader from "@/components/AppLoader";
import BusinessForm from "@/components/Business/BusinessForm";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { FC } from "react";

interface PageProps {}
const Page: FC<PageProps> = (props) => {
  const session = useSession();

  if (session.status === "loading") return <AppLoader />;

  if (session.status === "unauthenticated") return redirect("/");

  return <BusinessForm />;
};

export default Page;
