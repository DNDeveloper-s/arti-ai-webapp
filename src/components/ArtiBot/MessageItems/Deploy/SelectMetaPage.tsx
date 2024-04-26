import { useGetUserProviders, useUserPages } from "@/api/user";
import SelectWithAutoComplete from "@/components/shared/renderers/SelectWithAutoComplete";
import { useBusiness } from "@/context/BusinessContext";
import { Platform, useUser } from "@/context/UserContext";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { AutoCompleteProps } from "antd";
import React, { Key } from "react";

interface SelectMetaPageProps extends AutoCompleteProps {
  pageValue?: string;
  useBusinessValues?: boolean;
  setPageValue: (
    val: string
  ) => void | React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function SelectMetaPage({
  pageValue: _pageValue,
  setPageValue,
  useBusinessValues = true,
  ...props
}: SelectMetaPageProps) {
  const { state } = useUser();
  const accessToken = Platform.getPlatform(
    state.data?.facebook
  )?.userAccessToken;
  const { data: pagesData, isLoading: isPagesLoading } = useUserPages();
  const { businessMap } = useBusiness();

  const pageValue = useBusinessValues
    ? businessMap.getFacebookPage()?.provider_id
    : _pageValue;

  return (
    <Autocomplete
      inputProps={{
        classNames: {
          input: "!text-white",
          label: "!text-gray-500",
        },
      }}
      isDisabled={!pagesData || isPagesLoading}
      label="Social Media Page"
      allowsEmptyCollection
      placeholder={isPagesLoading ? "Fetching Pages..." : "Select a Page"}
      onSelectionChange={(key: Key) => {
        setPageValue(key as string);
      }}
      selectedKey={pageValue}
      {...props}
    >
      {pagesData && pagesData.length > 0 ? (
        ["", ...pagesData].map((page) =>
          typeof page === "string" ? (
            <AutocompleteItem
              key={""}
              textValue={""}
              classNames={{
                base: "hidden",
              }}
            ></AutocompleteItem>
          ) : (
            <AutocompleteItem key={page.id} textValue={page.name}>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={page.picture} className="w-6 h-6" alt="Page" />
                {page.name}
              </div>
            </AutocompleteItem>
          )
        )
      ) : (
        <AutocompleteItem key={"no-page-found"} isReadOnly>
          No pages found
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}

export const SelectMetaPageFormControl = ({
  name = "page_id",
}: {
  name?: string;
}) => {
  const { facebookPages, isLoading: isPagesLoading } = useUserPages();

  return (
    <SelectWithAutoComplete
      label="Facebook Page"
      name={name}
      isDisabled={!facebookPages || isPagesLoading}
      isFetching={isPagesLoading}
      placeholder="Select a Page"
      items={facebookPages?.map((page) => ({
        uid: page.id,
        name: page.name,
      }))}
    />
  );
};

export const SelectInstagramPageFormControl = ({
  name = "page_id",
}: {
  name?: string;
}) => {
  const { instagramPages, isLoading: isPagesLoading } = useUserPages();

  return (
    <SelectWithAutoComplete
      label="Instagram Page"
      name={name}
      isDisabled={!instagramPages || isPagesLoading}
      isFetching={isPagesLoading}
      placeholder="Select a Page"
      items={instagramPages?.map((page) => ({
        uid: page.id,
        name: page.name,
      }))}
    />
  );
};
