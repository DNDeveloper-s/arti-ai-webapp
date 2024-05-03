"use client";

import React, { createContext, FC, useEffect, useState } from "react";

export interface ISnackbarData {
  status: "warning" | "error" | "success" | "info" | "progress";
  message: string;
}

export type SnackbarData = ISnackbarData | null | false;

interface ISnackbarContext {
  snackBarData: [
    snackBarData: SnackbarData,
    setSnackBarData: React.Dispatch<React.SetStateAction<SnackbarData>>,
  ];
}

export const SnackbarContext = createContext<ISnackbarContext>(
  {} as ISnackbarContext
);

const SnackbarContextProvider: FC<{ children: React.ReactElement }> = (
  props
) => {
  const [snackBarData, setSnackBarData] = useState<SnackbarData>(null);

  return (
    <SnackbarContext.Provider
      value={{
        snackBarData: [snackBarData, setSnackBarData],
      }}
    >
      {props.children}
    </SnackbarContext.Provider>
  );
};

export default SnackbarContextProvider;
