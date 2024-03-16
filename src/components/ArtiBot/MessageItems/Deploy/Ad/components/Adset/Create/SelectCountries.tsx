import { useGetCountries } from "@/api/user";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@nextui-org/react";

export default function SelectCountries(
  props: Omit<AutocompleteProps, "children">
) {
  const { data: countries, isLoading } = useGetCountries();

  return (
    <Autocomplete
      inputProps={{
        classNames: {
          input: "!text-white",
          label: "!text-gray-500",
        },
      }}
      isDisabled={isLoading}
      label="Country"
      placeholder={isLoading ? "Fetching Countries..." : "Select Country"}
      {...props}
    >
      {countries && countries.length > 0 ? (
        countries.map((country) => (
          <AutocompleteItem
            key={country.uid}
            textValue={`${country.country}, ${country.region}`}
          >
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {country.country}, {country.region}
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
