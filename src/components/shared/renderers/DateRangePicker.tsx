import { DatePicker } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import { FieldName, WatchObserver, useFormContext } from "react-hook-form";
import Element from "./Element";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import ErrorComponent from "../error/ErrorComponent";
import { Dayjs } from "dayjs";
import { NoUndefinedRangeValueType } from "rc-picker/lib/PickerInput/RangePicker";

const { RangePicker } = DatePicker;

interface DateRangePickerProps extends RangePickerProps {}

export default function DateRangePicker({ ...props }: DateRangePickerProps) {
  return <RangePicker {...props} />;
}

const DateRangePickerControlComponent = (props: {
  name: string;
  label: string;
}) => {
  const methods = useFormContext();

  if (!methods) throw new Error("useFormContext is required");

  const dateValue = methods.watch(props.name);

  return (
    <div className="flex-1">
      <label
        htmlFor=""
        className=" ml-1 !text-gray-500 text-small block transform scale-85 origin-top-left"
      >
        {props.label}
      </label>
      <DateRangePicker
        format={"YYYY-MM-DD"}
        className="!h-[40px] !w-full"
        showTime
        variant="filled"
        value={dateValue}
        onChange={(val) => methods.setValue(props.name, val)}
      />
      <Element
        type="p"
        className="text-small text-danger mt-1"
        content={methods.formState.errors[props.name]?.message}
      />
    </div>
  );
};

export const DateRangePickerControl = (
  props: DateRangePickerProps & { name: string; label: string }
) => {
  return (
    <ErrorBoundary errorComponent={ErrorComponent}>
      <DateRangePickerControlComponent {...props} />
    </ErrorBoundary>
  );
};
