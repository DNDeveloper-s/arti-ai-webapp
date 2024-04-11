import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import RegisterBusiness from "@/components/Business/RegisterBusiness";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FC } from "react";

interface PageProps {}
const Page: FC<PageProps> = async (props) => {
  const session = await getServerSession(authOptions);

  if (!session) return redirect("/");

  return <RegisterBusiness />;
};

export default Page;
