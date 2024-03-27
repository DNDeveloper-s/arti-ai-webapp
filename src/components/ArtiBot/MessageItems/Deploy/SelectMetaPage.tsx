import { useUserPages } from "@/api/user";
import { Platform, useUser } from "@/context/UserContext";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { AutoCompleteProps } from "antd";
import React, { Key } from "react";

interface SelectMetaPageProps extends AutoCompleteProps {
  pageValue?: string;
  setPageValue: (
    val: string
  ) => void | React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function SelectMetaPage({
  pageValue,
  setPageValue,
  ...props
}: SelectMetaPageProps) {
  const { state } = useUser();
  const accessToken = Platform.getPlatform(
    state.data?.facebook
  )?.userAccessToken;
  const { data: pagesData, isLoading: isPagesLoading } =
    useUserPages(accessToken);

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
