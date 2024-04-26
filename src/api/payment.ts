import { ROUTES } from "@/config/api-config";
import API_QUERIES from "@/config/api-queries";
import { SnackbarContext } from "@/context/SnackbarContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";

interface CreatePaymentResponse {
  id: string;
  url: string;
  [key: string]: any;
}

type PaymentMode = "payment" | "subscription";
interface CreatePaymentFields {
  amount?: number;
  price_id?: string;
  mode?: PaymentMode;
}
export const useCreatePayment = () => {
  const [, setSnackBarData] = useContext(SnackbarContext).snackBarData;
  const createPayment = async (
    data: CreatePaymentFields
  ): Promise<CreatePaymentResponse> => {
    const response = await axios.post(ROUTES.PAYMENT.CHECKOUT, {
      ...data,
      product_name: "Arti AI Credits",
      success_callback: window.location.origin + "/?payment=success",
      cancel_callback: window.location.origin + "/settings?payment=cancel",
      mode: data.mode ?? "payment",
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

const products = {
  id: "prod_Pw2TdMXzE4DrBT",
  name: "Arti AI Subscription",
  description: "Arti AI Credit Subscription.",
  images: [
    "https://files.stripe.com/links/MDB8YWNjdF8xUDROamxTSkQ0Smk1M1d1fGZsX3Rlc3RfaDhsQmtSUnlnUFNYV0RiRzFpQzh1N2I400zqHIKQez",
  ],
  prices: [
    {
      id: "price_1P8I5FSJD4Ji53Wu2OsBOBG2",
      currency: "usd",
      recurring: {
        aggregate_usage: null,
        interval: "month",
        interval_count: 1,
        meter: null,
        trial_period_days: null,
        usage_type: "licensed",
      },
      amount: 1999,
    },
    {
      id: "price_1P6AOoSJD4Ji53WuUxlVZaNL",
      currency: "usd",
      recurring: {
        aggregate_usage: null,
        interval: "month",
        interval_count: 1,
        meter: null,
        trial_period_days: null,
        usage_type: "licensed",
      },
      amount: 2999,
    },
  ],
};

interface PriceObject {
  id: string;
  currency: string;
  recurring: {
    aggregate_usage: any;
    interval: string;
    interval_count: number;
    meter: any;
    trial_period_days: any;
    usage_type: string;
  };
  amount: number;
  name: string;
}

interface ProductObject {
  id: string;
  name: string;
  description: string;
  images: string[];
  prices: PriceObject[];
}

type GetProductsResponse = ProductObject;

export const useGetProducts = () => {
  const getProducts = async () => {
    const response = await axios.get(ROUTES.PAYMENT.PRODUCTS);
    return response.data.data;
  };
  return useQuery<GetProductsResponse>({
    queryKey: API_QUERIES.GET_PRODUCTS,
    queryFn: getProducts,
  });
};

export interface SubscriptionObject {
  id: string;
  subscription_id: string;
  currency: string;
  customer_id: string;
  price_id: string;
  plan_name: string;
  userId: string;
  amount: number;
  current_period_start: string;
  current_period_end: string;
  status: string;
  created_at: string;
  updated_at: string;
  canceled_at: string;
}

type GetSubscriptionResponse = SubscriptionObject;

export const useGetMySubscriptions = () => {
  const getSubscriptions = async () => {
    const response = await axios.get(ROUTES.USERS.SUBSCRIPTIONS);
    return response.data.data;
  };
  return useQuery<GetSubscriptionResponse>({
    queryKey: API_QUERIES.GET_SUBSCRIPTIONS,
    queryFn: getSubscriptions,
  });
};

export const useCancelSubscription = () => {
  const [, setSnackBarData] = useContext(SnackbarContext).snackBarData;
  const qc = useQueryClient();

  const cancelSubscription = async () => {
    setSnackBarData({
      status: "progress",
      message: "Cancelling subscription...",
    });
    const response = await axios.delete(ROUTES.PAYMENT.SUBSCRIPTIONS);
    return response.data.data;
  };

  return useMutation({
    mutationFn: cancelSubscription,
    onError: (error) => {
      setSnackBarData({
        message: error.message ?? "Subscription cancel failed",
        status: "error",
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: API_QUERIES.GET_SUBSCRIPTIONS });
    },
    onSuccess: (data) => {
      setSnackBarData({
        message: data.message ?? "Subscription cancel successful",
        status: "success",
      });
    },
  });
};
