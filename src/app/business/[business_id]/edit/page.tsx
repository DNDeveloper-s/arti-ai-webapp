"use client";
import BusinessForm from "@/components/Business/BusinessForm";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  return <BusinessForm business_id={params.business_id?.toString()} />;
}
