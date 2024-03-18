import { useGetCountries } from "@/api/user";
import { Select, SelectProps, Spin } from "antd";
import { useMemo } from "react";

export default function SelectCountries(props: SelectProps) {
  const { data: countries, isFetching } = useGetCountries();

  const options = useMemo(() => {
    return (
      countries?.map((country) => ({
        value: country.uid,
        label: country.country + ", " + country.region,
        uid: country.uid,
        countryObj: country,
      })) ?? []
    );
  }, [countries]);

  const filterOption = (input: string, option?: any) => {
    return (
      (option?.countryObj.country ?? "")
        .toLowerCase()
        .includes(input.toLowerCase()) ||
      (option?.countryObj.region ?? "")
        .toLowerCase()
        .includes(input.toLowerCase())
    );
  };

  return (
    <div className="w-full flex flex-col">
      <label
        htmlFor=""
        className=" ml-1 !text-gray-500 text-small block transform scale-85 origin-top-left"
      >
        Country
      </label>
      <Select
        mode="multiple"
        labelInValue
        variant="filled"
        filterOption={filterOption}
        notFoundContent={isFetching ? <Spin size="small" /> : null}
        options={options}
        placeholder="Select Countries"
        {...props}
      />
    </div>
  );
}
