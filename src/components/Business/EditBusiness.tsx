"use client";

import { useParams } from "next/navigation";
import BusinessForm from "./BusinessForm";

export default function EditBusiness() {
  const params = useParams();
  return <BusinessForm business_id={params.business_id?.toString()} />;
}
