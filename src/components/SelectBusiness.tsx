import { useQueryUserBusiness } from "@/api/conversation";
import SelectWithAutoComplete from "./shared/renderers/SelectWithAutoComplete";
import { useRouter } from "next/navigation";
import { Key, useEffect } from "react";
import { useBusiness } from "@/context/BusinessContext";

export default function SelectBusiness() {
  const { data, isFetching } = useQueryUserBusiness();
  const router = useRouter();
  const { business, setBusiness } = useBusiness();

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
      onSelectionChange={(key: Key) => {
        console.log("Testing | key - ", key, data);
        const businessObj = data?.find((business) => business.id === key);
        businessObj && setBusiness(businessObj);
      }}
      selectedKey={business?.id}
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
