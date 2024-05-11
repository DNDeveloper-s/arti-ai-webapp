"use client";

import { useValidateVerificationCode } from "@/api/auth";
import { ErrorMasterComponent } from "@/components/shared/error/ErrorComponent";
import { SnackbarContext } from "@/context/SnackbarContext";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useContext, useEffect } from "react";

function VerifyToken() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const { mutate: postValidateCode } = useValidateVerificationCode({
    onSettled: () => {
      router.push("/");
    },
  });
  const [, setSnackbarData] = useContext(SnackbarContext).snackBarData;

  useEffect(() => {
    if (!token) {
      setSnackbarData({
        message: "Token is missing",
        status: "error",
      });
      return router.push("/");
    }

    postValidateCode({ code: token });
  }, [token, postValidateCode, setSnackbarData, router]);

  return null;
}

export default function VerifyTokenPage() {
  return (
    <ErrorBoundary errorComponent={ErrorMasterComponent}>
      <Suspense>
        <VerifyToken />
      </Suspense>
    </ErrorBoundary>
  );
}
