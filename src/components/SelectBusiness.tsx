import { useQueryUserBusiness } from "@/api/conversation";
import SelectWithAutoComplete from "./shared/renderers/SelectWithAutoComplete";
import { useRouter } from "next/navigation";
import { Key, useEffect } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { MdEdit } from "react-icons/md";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import CTAButton from "./CTAButton";

export default function SelectBusiness() {
  const { data, isFetching } = useQueryUserBusiness();
  const router = useRouter();
  const { business, setBusiness } = useBusiness();

  useEffect(() => {
    router.prefetch("/business/register");
  }, [router]);

  const handleEdit = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.stopPropagation();
    router.push("/business/" + business?.id + "/edit");
  };

  if (data?.length === 0) {
    return (
      <Link href={"/business/register"} prefetch={true}>
        <CTAButton className="py-1.5 rounded-lg text-sm">
          <span>Create Business</span>
        </CTAButton>
      </Link>
    );
  }

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
        const businessObj = data?.find((business) => business.id === key);
        businessObj && setBusiness(businessObj);
      }}
      endContent={
        <MdEdit className="text-xl cursor-pointer" onClick={handleEdit} />
      }
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
