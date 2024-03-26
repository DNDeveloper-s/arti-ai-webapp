import { useGetAdAccounts } from "@/api/user";
import useCampaignStore from "@/store/campaign";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Key } from "react";

export const SelectAdAccountPicker = ({
  selectedKey,
  setSelectedKey,
}: {
  selectedKey?: string;
  setSelectedKey: (
    val: string
  ) => void | React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const { data: adAccounts, isFetching } = useGetAdAccounts();
  return (
    <Autocomplete
      inputProps={{
        classNames: {
          input: "!text-white",
          label: "!text-gray-500 !text-[12px]",
        },
      }}
      isDisabled={isFetching}
      label="Ad Account"
      placeholder={isFetching ? "Fetching Ad Accounts" : "Select Ad Account"}
      onSelectionChange={(key: Key) => {
        setSelectedKey(key as string);
      }}
      selectedKey={selectedKey}
      classNames={{
        base: "max-w-[250px]",
      }}
      isClearable={false}
      size="sm"
    >
      {adAccounts && adAccounts.length > 0 ? (
        adAccounts.map((adAccount) => (
          <AutocompleteItem key={adAccount.id} textValue={adAccount.name}>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {adAccount.name}
            </div>
          </AutocompleteItem>
        ))
      ) : (
        <AutocompleteItem key={"no-country-found"} isReadOnly>
          No Ad Account found
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
};

export default function SelectAdAccount() {
  const { selectedAccountId, setSelectAdAccount } = useCampaignStore();
  return (
    <SelectAdAccountPicker
      selectedKey={selectedAccountId}
      setSelectedKey={setSelectAdAccount}
    />
  );
}
