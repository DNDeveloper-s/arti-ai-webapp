import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@nextui-org/react";
import { Button } from "antd";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Key, ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import ErrorComponent from "../error/ErrorComponent";

interface SelectWithAutoCompleteItem {
  uid: string;
  name: string;
}

interface SelectWithAutoCompleteComponent {
  key: Key;
  label: string;
  onClick: () => void;
}

type SelectWithAutoCompletePropWithControl = {
  noControl?: false;
  name: string;
} & Omit<
  AutocompleteProps,
  "label" | "children" | "selectedKey" | "onSelectionChange"
>;

type SelectWithAutoCompletePropWithoutControl = {
  noControl: true;
} & Omit<AutocompleteProps, "label" | "children">;

export type SelectWithAutoCompleteProps = {
  isFetching?: boolean;
  plural?: string;
  label: string;
  placeholder?: string;
  items: SelectWithAutoCompleteItem[] | undefined;
  components?: SelectWithAutoCompleteComponent[];
} & (
  | SelectWithAutoCompletePropWithControl
  | SelectWithAutoCompletePropWithoutControl
);

/**
 * @param param0
 * @returns
 */
function SelectWithAutoCompleteComponent({
  isFetching = false,
  items,
  components,
  plural,
  noControl,
  placeholder,
  ...props
}: SelectWithAutoCompleteProps) {
  let methods = useFormContext();

  if (!methods && !noControl)
    throw new Error("useFormContext must be used within a FormProvider");

  const value = props.name ? methods.watch(props.name) : "";

  console.log(props.name + " - " + value);

  let localProps = {};
  if (!noControl) {
    localProps = {
      onSelectionChange: (key: Key) => {
        props.name &&
          methods.setValue(props.name, key, { shouldValidate: true });
      },
      selectedKey: value,
    };
  }

  return (
    <Autocomplete
      inputProps={{
        classNames: {
          input: "!text-white",
          label: "!text-gray-500",
        },
      }}
      // disabledKeys={["disabled"]}
      isDisabled={isFetching || props.isDisabled}
      placeholder={
        isFetching
          ? `Fetching ${plural ?? "Item"}`
          : `${placeholder ?? props.label}`
      }
      errorMessage={
        methods?.formState.errors[props.name ?? ""]?.message as string
      }
      {...localProps}
      {...props}
    >
      {/* @ts-ignore */}
      {items &&
        items.map((item) => (
          <AutocompleteItem key={item.uid} textValue={item.name}>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {item.name}
            </div>
          </AutocompleteItem>
        ))}
      {/* @ts-ignore */}
      {components &&
        components.map((component, index) => (
          <AutocompleteItem
            style={{ pointerEvents: "all", cursor: "default !important" }}
            key={component.key}
            textValue={""}
          >
            <div className="flex cursor-pointer items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <Button
                color="primary"
                className="w-full"
                onClick={component.onClick}
              >
                {component.label ?? "Create Item"}
              </Button>
            </div>
          </AutocompleteItem>
        ))}
    </Autocomplete>
  );
}

export default function SelectWithAutoComplete(
  props: SelectWithAutoCompleteProps
) {
  return (
    <ErrorBoundary errorComponent={ErrorComponent}>
      <SelectWithAutoCompleteComponent {...props} />
    </ErrorBoundary>
  );
}

{
  /* <AutocompleteItem key="disabled">
        <p>Group</p>
      </AutocompleteItem> */
}
