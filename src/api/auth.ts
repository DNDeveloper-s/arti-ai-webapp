import { ROUTES } from "@/config/api-config";
import API_QUERIES from "@/config/api-queries";
import { SnackbarContext } from "@/context/SnackbarContext";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";

export interface SendEmailVerificationRequestVariables {
  email: string;
  type: "updateEmail" | "verifyEmail";
}

export const useSendEmailVerificationRequest = (
  props: UseMutationOptions<
    any,
    Error,
    SendEmailVerificationRequestVariables,
    any
  > = {}
) => {
  const { onError, onSuccess, onSettled, ...options } = props;
  const [, setSnackbarData] = useContext(SnackbarContext).snackBarData;
  const sendEmailVerificationRequest = async (
    data: SendEmailVerificationRequestVariables
  ) => {
    // Send email verification request
    const response = await axios.post(
      ROUTES.USERS.SEND_EMAIL_VERIFICATION_REQUEST,
      data
    );

    return response.data.data;
  };
  return useMutation({
    mutationFn: sendEmailVerificationRequest,
    onSettled: (data, error, variables, ...rest) => {
      onSettled && onSettled(data, error, variables, ...rest);
    },
    onSuccess: (data, variables, ...rest) => {
      setSnackbarData({
        message: "Email verification request sent successfully",
        status: "success",
      });
      onSuccess && onSuccess(data, variables, ...rest);
    },
    onError: (error, variables, ...rest) => {
      setSnackbarData({
        message: "Error in requesting email verification",
        status: "error",
      });
      onError && onError(error, variables, ...rest);
    },
    ...options,
  });
};

export const useValidateVerificationCode = (
  props: UseMutationOptions<any, Error, { code: string }, any> = {}
) => {
  const { onError, onSuccess, onSettled, ...options } = props;
  const [, setSnackbarData] = useContext(SnackbarContext).snackBarData;
  const qc = useQueryClient();
  const validateVerificationCode = async (data: { code: string }) => {
    // Send email verification request
    const response = await axios.post(
      ROUTES.USERS.VALIDATE_VERIFICATION_CODE,
      data
    );

    return response.data.data;
  };
  return useMutation({
    mutationFn: validateVerificationCode,
    onSettled: (data, error, variables, ...rest) => {
      qc.invalidateQueries({
        queryKey: API_QUERIES.GET_ME,
      });
      onSettled && onSettled(data, error, variables, ...rest);
    },
    onSuccess: (data, variables, ...rest) => {
      !onSuccess &&
        setSnackbarData({
          message: "Email verified successfully",
          status: "success",
        });
      onSuccess && onSuccess(data, variables, ...rest);
    },
    onError: (error, variables, ...rest) => {
      !onError &&
        setSnackbarData({
          message: error?.message ?? "Error in verifying the emal",
          status: "error",
        });
      onError && onError(error, variables, ...rest);
    },
    ...options,
  });
};
