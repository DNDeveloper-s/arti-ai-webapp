import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import BusinessForm from "@/components/Business/BusinessForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FC } from "react";

interface PageProps {}
const Page: FC<PageProps> = async (props) => {
  const session = await getServerSession(authOptions);

  if (!session) return redirect("/");

  return <BusinessForm />;
};

export default Page;
