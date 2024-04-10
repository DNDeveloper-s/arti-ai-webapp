"use client";

import AppLoader from "@/components/AppLoader";
import RegisterBusiness from "@/components/Business/RegisterBusiness";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { FC } from "react";

interface PageProps {}

const Page: FC<PageProps> = (props) => {
  const { status } = useSession();

  if (status === "loading") return <AppLoader />;

  if (status === "unauthenticated") return redirect("/");

  return <RegisterBusiness />;
};

export default Page;
