"use client";

import { Dayjs } from "dayjs";
import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { RangeValueType } from "rc-picker/lib/PickerInput/RangePicker";

type ITimeRangeState = {
  timeRange?: RangeValueType<Dayjs> | undefined;
};

export const initTimeRangeState: ITimeRangeState = {
  timeRange: undefined,
};

enum TIMERANGE_ACTION_TYPE {
  SET = "SET",
}

interface TimeRangeAction {
  type: TIMERANGE_ACTION_TYPE;
  payload: Partial<ITimeRangeState>;
}

function TimeRangeReducer(
  state: ITimeRangeState,
  action: TimeRangeAction
): ITimeRangeState {
  const { type, payload } = action;
  switch (type) {
    default:
      return state;
  }
}

const useTimeRangeContext = (initState: ITimeRangeState) => {
  const [state, dispatch] = useReducer(TimeRangeReducer, initState);
  const [rangeValue, setRangeValue] = useState<
    RangeValueType<Dayjs> | undefined
  >(undefined);

  function setRangeValueFn(props: any) {
    console.log("props - ", props);
    setRangeValue(props);
  }

  return {
    setTimeRange: setRangeValueFn,
    state,
    timeRange: rangeValue,
    dispatch,
  };
};

type UseTimeRangeContextType = ReturnType<typeof useTimeRangeContext>;

export const TimeRangeContext = createContext<UseTimeRangeContextType>({
  state: initTimeRangeState,
  dispatch: () => {},
  timeRange: undefined,
  setTimeRange: () => {},
});

const TimeRangeContextProvider: FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const context = useTimeRangeContext({ timeRange: undefined });

  return (
    <TimeRangeContext.Provider value={context}>
      {children}
    </TimeRangeContext.Provider>
  );
};

type UseTimeRangeHookType = {
  state: ITimeRangeState;
  dispatch: (action: TimeRangeAction) => void;
  timeRange: RangeValueType<Dayjs> | undefined;
  setTimeRange: (range: RangeValueType<Dayjs>) => void;
};

function useTimeRange(): UseTimeRangeHookType {
  const context = useContext(TimeRangeContext);
  if (context === undefined) {
    throw new Error(
      "useTimeRange must be used within a TimeRangeContextProvider"
    );
  }

  return context;
}

export { useTimeRange, TimeRangeContextProvider };
