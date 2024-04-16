import { ROUTES } from "@/config/api-config";
import { SnackbarContext } from "@/context/SnackbarContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";

interface CreatePaymentResponse {
  id: string;
  url: string;
  [key: string]: any;
}

interface CreatePaymentFields {
  amount: number;
}
export const useCreatePayment = () => {
  const [, setSnackBarData] = useContext(SnackbarContext).snackBarData;
  const createPayment = async (
    data: CreatePaymentFields
  ): Promise<CreatePaymentResponse> => {
    const response = await axios.post(ROUTES.PAYMENT.CHECKOUT, {
      ...data,
      product_name: "Arti AI Credits",
      success_callback: window.location.origin + "/",
      cancel_callback: window.location.origin + "/settings",
    });

    return response.data.data;
  };
  return useMutation<CreatePaymentResponse, Error, CreatePaymentFields>({
    mutationFn: createPayment,
    onError: (error) => {
      setSnackBarData({
        message: error.message ?? "Payment failed",
        status: "error",
      });
    },
    onSuccess: (data) => {
      setSnackBarData({
        message: data.message ?? "Payment successful",
        status: "success",
      });
    },
  });
};
