import { useGetGenericLocations } from "@/api/user";
import { tooltips } from "@/constants/adCampaignData/tooltips";
import { debounce } from "@/helpers";
import { Tooltip } from "@nextui-org/react";
import { Select, SelectProps, Spin } from "antd";
import { compact, pullAllBy } from "lodash";
import { useMemo, useRef, useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";

export default function SelectLocations(props: SelectProps) {
  const { value: initialData } = props;
  const [query, setQuery] = useState("");
  const { data, isFetching } = useGetGenericLocations(query, initialData);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string, option: any) => {
      setQuery(value);
    };

    return debounce(loadOptions, 400);
  }, []);

  const options = useMemo(() => {
    // const clonedData = [...(data ?? [])];
    // const uniqueData = pullAllBy(clonedData, initialData, "key");
    return (
      data?.map((location) => {
        if (location.label) return location;
        const locationArr = compact([
          location.name,
          location.primary_city,
          location.region,
          location.country_name,
          location.country_code,
        ]);
        return {
          ...location,
          value: location.key + "-" + location.type,
          label: (
            <div className="flex items-center justify-between gap-3 px-1">
              <span>{locationArr.join(", ")}</span>
            </div>
          ),
          name: location.name,
          uid: location.key,
          id: location.key,
        };
      }) ?? []
    );
  }, [data]);

  return (
    <div className="w-full flex flex-col">
      <label
        htmlFor=""
        className=" ml-1 !text-gray-500 text-small flex items-center justify-between transform scale-85 origin-top-left"
      >
        <span>City, Region or Country</span>
        <Tooltip placement="top-end" content={tooltips.adset.location}>
          <AiOutlineQuestionCircle />
        </Tooltip>
      </label>
      <Select
        mode="multiple"
        labelInValue
        variant="filled"
        filterOption={false}
        onSearch={debounceFetcher}
        loading={isFetching}
        notFoundContent={isFetching ? <Spin size="small" /> : null}
        options={options}
        placeholder="Select City, Region or Country"
        {...props}
      />
    </div>
  );
}
