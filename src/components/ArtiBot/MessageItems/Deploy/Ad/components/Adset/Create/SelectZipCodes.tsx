import { useGetCountries, useGetZipCodes } from "@/api/user";
import { Platform, useUser } from "@/context/UserContext";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@nextui-org/react";
import { Select } from "antd";
import { useRef, useState } from "react";

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
export default function SelectZipCodes(
  props: Omit<AutocompleteProps, "children">
) {
  const { state } = useUser();
  const accessToken = Platform.getPlatform(
    state.data?.facebook
  )?.userAccessToken;
  const [value, setValue] = useState("");
  const [zipCode, setZipCode] = useState("");
  const { data: zipCodes, isLoading } = useGetZipCodes(zipCode, accessToken);
  const timerRef = useRef<NodeJS.Timeout>();

  console.log("testing | zipCodes - ", zipCodes);

  return (
    <Autocomplete
      inputProps={{
        classNames: {
          input: "!text-white",
          label: "!text-gray-500",
        },
      }}
      label="Zip Code"
      {...props}
      onInputChange={(_val) => {
        clearTimeout(timerRef.current);
        setValue(_val);
        timerRef.current = setTimeout(() => {
          setZipCode(_val);
        }, 500);
      }}
      inputValue={value}
    >
      {zipCodes && zipCodes.length > 0 ? (
        zipCodes.map((zipCode) => (
          <AutocompleteItem
            key={zipCode.region_id}
            textValue={`${zipCode.name}, ${zipCode.primary_city}, ${zipCode.region}, ${zipCode.country_name}, ${zipCode.country_code}`}
          >
            <div className="flex items-center gap-3">
              {zipCode.name}, {zipCode.primary_city}, {zipCode.region},{" "}
              {zipCode.country_name}, {zipCode.country_code}
            </div>
          </AutocompleteItem>
        ))
      ) : (
        <AutocompleteItem key={"no-country-found"} isReadOnly>
          No countries found
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}

function SelectZipCodes2(props: Omit<AutocompleteProps, "children">) {
  const { state } = useUser();
  const accessToken = Platform.getPlatform(
    state.data?.facebook
  )?.userAccessToken;
  const [value, setValue] = useState("");
  const [zipCode, setZipCode] = useState("");
  const { data: zipCodes, isLoading } = useGetZipCodes(zipCode, accessToken);
  const timerRef = useRef<NodeJS.Timeout>();

  console.log("testing | zipCodes - ", zipCodes);

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  return (
    <div></div>
    // <Select
    //   mode="tags"
    //   style={{ width: "100%" }}
    //   placeholder="Tags Mode"
    //   on
    //   onChange={handleChange}
    //   options={options}
    // />
  );
}
