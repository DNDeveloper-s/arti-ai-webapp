import { IAdVariant } from "@/interfaces/IArtiBot";
import { useEffect, useState } from "react";
import ActionButton from "../ActionButton";
import CreateAd from "./Create/CreateAd";
import CreateAdset from "./Create/CreateAdset";
import ViewAds from "./View/ViewAds";
import ViewCampaign from "./View/ViewAds";

export default function AdsView() {
  const [isInCreateMode, setCreateMode] = useState(false);

  const onCreateButtonTap = () => {
    setCreateMode(true);
  };

  const onBackButtonTap = () => {
    setCreateMode(false);
  };

  return <ViewAds />;
}
