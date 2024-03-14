import { useEffect, useState } from "react";
import ActionButton from "../ActionButton";
import CreateCampaign from "./Create/CreateCampaign";
import ViewCampaign from "./View/ViewCampaign";

export default function CampaignView({
  accessToken,
  onCampaignCreation,
  onCampaignSelection,
}: {
  accessToken?: string;
  onCampaignCreation?: any;
  onCampaignSelection?: any;
}) {
  return (
    <>
      <ViewCampaign />
    </>
  );
}
