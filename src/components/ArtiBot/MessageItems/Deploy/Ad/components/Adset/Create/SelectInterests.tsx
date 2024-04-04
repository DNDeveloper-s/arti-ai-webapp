import { useGetAdAccountId, useGetInterests } from "@/api/user";
import { Platform, useUser } from "@/context/UserContext";
import { debounce } from "@/helpers";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@nextui-org/react";
import { Select, SelectProps, Spin, Tag } from "antd";
import { useMemo, useRef, useState } from "react";

export interface SelectInterestResponseObject {
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
  initial?: boolean;
}
export default function SelectInterests(props: SelectProps) {
  const { value: initialData } = props;
  const [query, setQuery] = useState("");
  const { data, isFetching } = useGetInterests(query, initialData);
  const timerRef = useRef<NodeJS.Timeout>();

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string, option: any) => {
      setQuery(value);
    };

    return debounce(loadOptions, 400);
  }, []);

  const options = useMemo(() => {
    return (
      data?.map((interest) => {
        if (interest.initial) return interest;
        return {
          value: interest.id + "-" + interest.type,
          label: (
            <div className="flex items-center justify-between gap-3 px-1">
              <span>{interest.name}</span>
              <div className="bg-default-200 px-1 text-white rounded text-[10px]">
                <span>{interest.type}</span>
              </div>
            </div>
          ),
          name: interest.name,
          id: interest.id,
          path: interest.path,
          type: interest.type,
        };
      }) ?? []
    );
  }, [data]);

  function handleChange(value: any, option: any) {
    console.log("Test | value - ", value, option);
    // setValue(option);
  }

  return (
    <div className="w-full flex flex-col">
      <label
        htmlFor=""
        className=" ml-1 !text-gray-500 text-small block transform scale-85 origin-top-left"
      >
        Demographics, Interests or Behaviours (Hit &quot;Enter&quot; to add)
      </label>
      <Select
        mode="multiple"
        labelInValue
        variant="filled"
        filterOption={false}
        onSearch={debounceFetcher}
        notFoundContent={isFetching ? <Spin size="small" /> : null}
        options={options}
        placeholder="Search for Demographics, Interests or Behaviours"
        value={initialData}
        tagRender={(props) => {
          const { label, value, closable, onClose } = props;
          return (
            <Tag
              closable={closable}
              onClose={onClose}
              style={{
                marginRight: 3,
                height: "30px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {label}
            </Tag>
          );
        }}
        {...props}
      />
    </div>
  );
}
