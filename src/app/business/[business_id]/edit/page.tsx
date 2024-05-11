"use client";
import BusinessForm from "@/components/Business/BusinessForm";
import { ErrorMasterComponent } from "@/components/shared/error/ErrorComponent";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  return (
    <ErrorBoundary errorComponent={ErrorMasterComponent}>
      <BusinessForm business_id={params.business_id?.toString()} />
    </ErrorBoundary>
  );
}
