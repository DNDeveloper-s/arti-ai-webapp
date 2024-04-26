import { useGetCountries } from "@/api/user";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import { SupportedPlatform } from "@/context/UserContext";
import { Select, SelectProps, Spin } from "antd";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

const platforms = [
  { uid: SupportedPlatform.facebook, name: "Facebook" },
  { uid: SupportedPlatform.instagram, name: "Instagram" },
];
export default function SelectPlatform(props: SelectProps) {
  const options = useMemo(() => {
    return (
      platforms?.map((platform) => ({
        value: platform.uid,
        label: platform.name,
        uid: platform.uid,
        platformObj: platform,
      })) ?? []
    );
  }, []);

  return (
    <div className="w-full flex flex-col">
      <label
        htmlFor=""
        className=" ml-1 !text-gray-500 text-small block transform scale-85 origin-top-left"
      >
        Social Platform
      </label>
      <Select
        defaultValue={[
          { value: SupportedPlatform.facebook, label: "Facebook" },
          { value: SupportedPlatform.instagram, label: "Instagram" },
        ]}
        labelInValue
        variant="filled"
        options={options}
        placeholder="Select Platform"
        {...props}
      />
    </div>
  );
}

export const SelectPlatformControl = ({
  name = "platform",
  ...props
}: { name?: string } & SelectProps) => {
  let methods = useFormContext();

  if (!methods)
    throw new Error("useFormContext must be used within a FormProvider");

  const value = name ? methods.watch(name) : "";

  return (
    <ErrorBoundary errorComponent={ErrorComponent}>
      <SelectPlatform
        value={
          value ?? [
            { value: SupportedPlatform.facebook, label: "Facebook" },
            { value: SupportedPlatform.instagram, label: "Instagram" },
          ]
        }
        onChange={(value: string, option: any) => {
          methods.setValue(name, option);
        }}
        {...props}
      />
    </ErrorBoundary>
  );
};
