import { useQueryUserBusiness } from "@/api/conversation";
import SelectWithAutoComplete from "./shared/renderers/SelectWithAutoComplete";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SelectBusiness() {
  const { data, isFetching } = useQueryUserBusiness();
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/business/register");
  }, [router]);

  return (
    <SelectWithAutoComplete
      noControl
      items={data?.map((business) => ({
        uid: business.id,
        name: business.name,
      }))}
      label="Select Business"
      plural="Businesses"
      isFetching={isFetching}
      classNames={{
        base: "max-w-[250px]",
      }}
      components={[
        {
          key: "create-business",
          label: "Create Business",
          onClick: () => {
            router.push("/business/register");
          },
        },
      ]}
    />
  );
}
