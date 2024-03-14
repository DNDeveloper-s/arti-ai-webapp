import { ISnackbarData, SnackbarContext } from "@/context/SnackbarContext";
import { AxiosError } from "axios";
import { useContext, useEffect } from "react";

interface IUseErrorNotificationProps {
  isError: boolean;
  fallbackMessage: string;
  error: AxiosError | any;
  status?: ISnackbarData["status"];
}

export default function useErrorNotification({
  isError,
  error,
  fallbackMessage,
  status = "error",
}: IUseErrorNotificationProps) {
  const [, setSnackBarData] = useContext(SnackbarContext).snackBarData;

  useEffect(() => {
    if (isError) {
      const message =
        error instanceof AxiosError
          ? error.response?.data.message ?? fallbackMessage
          : fallbackMessage;
      setSnackBarData({ message, status });
    }
  }, [isError, setSnackBarData, error, fallbackMessage, status]);
}
