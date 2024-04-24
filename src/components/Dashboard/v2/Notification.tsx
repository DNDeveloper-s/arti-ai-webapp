"use client";

import { SnackbarContext } from "@/context/SnackbarContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";

export default function DashboardNotification() {
  const [, setSnackbarData] = useContext(SnackbarContext).snackBarData;
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment");

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (paymentStatus === "success") {
      // show success notification
      setSnackbarData({
        message: "Payment successful",
        status: "success",
      });
    }
    if (paymentStatus === "cancel") {
      // show cancel notification
      setSnackbarData({
        message: "Payment cancelled",
        status: "error",
      });
    }
    if (paymentStatus) {
      // Remove the "payment" query parameter from the URL
      const { payment, ...rest } = Object.fromEntries(searchParams.entries());
      router.replace(pathname + "?" + new URLSearchParams(rest).toString());
    }
  }, [paymentStatus, setSnackbarData, pathname, searchParams, router]);

  return null;
}
