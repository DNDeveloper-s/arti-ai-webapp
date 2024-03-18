import { useGetCountries, useGetZipCodes } from "@/api/user";
import { Platform, useUser } from "@/context/UserContext";
import { debounce } from "@/helpers";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@nextui-org/react";
import { Select, SelectProps, Spin } from "antd";
import { useMemo, useRef, useState } from "react";

export interface ZipCodeResponseObject {
  country_code: string;
  country_name: string;
  region: string;
  primary_city: string;
  key: string;
  name: string;
  primary_city_id: number;
  region_id: number;
  supports_city: boolean;
  supports_region: boolean;
  type: "zip";
}

export default function SelectZipCodes(props: SelectProps) {
  const { state } = useUser();
  const accessToken = Platform.getPlatform(
    state.data?.facebook
  )?.userAccessToken;
  const [value, setValue] = useState("");
  const [zipCode, setZipCode] = useState("");
  const { data, isFetching } = useGetZipCodes(zipCode, accessToken);
  const timerRef = useRef<NodeJS.Timeout>();

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string, option: any) => {
      console.log("loadOptions - ", value, option);
      setZipCode(value);
    };

    return debounce(loadOptions, 400);
  }, []);

  const options = useMemo(() => {
    return data?.map((zipCode) => ({
      label: `${zipCode.name}, ${zipCode.primary_city}, ${zipCode.region}, ${zipCode.country_name}, ${zipCode.country_code}`,
      value: zipCode.key,
      uid: zipCode.region_id,
    }));
  }, [data]);

  return (
    <div className="w-full flex flex-col">
      <label
        htmlFor=""
        className=" ml-1 !text-gray-500 text-small block transform scale-85 origin-top-left"
      >
        Zip Codes
      </label>
      <Select
        mode="multiple"
        labelInValue
        variant="filled"
        filterOption={false}
        onSearch={debounceFetcher}
        notFoundContent={isFetching ? <Spin size="small" /> : null}
        options={options}
        placeholder="Select Zip Codes"
        {...props}
      />
    </div>
  );
}
