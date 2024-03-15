import { IAdVariant } from "@/interfaces/IArtiBot";
import { useState } from "react";
import CampaignView from "./components/Campaign/CampaignView";
import TabView from "./components/TabView";
import AdsetView from "./components/Adset/AdsetView";
import AdsView from "./components/Ads/AdsView";

interface TabItem {
  id: number;
  name: string;
}

export default function DeployAdLayout({
  accessToken,
  variant,
}: {
  accessToken: string;
  variant: IAdVariant;
}) {
  const tabList: TabItem[] = [
    { id: 0, name: "Campaigns" },
    { id: 1, name: "Ad Sets" },
    { id: 2, name: "Ads" },
  ];

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabItem>(tabList[0]);

  const [campaignId, setCampaignId] = useState("");
  const [campaignObjective, setCampaignObjective] = useState("");
  const [adsetId, setAdsetId] = useState("");

  const handleCampaignCreation = (
    campaignId: string,
    campaignObjective: string
  ) => {
    setCampaignId(campaignId);
    setCampaignObjective(campaignObjective);
    setActiveTab(tabList[1]);
  };

  const handleAdsetCreation = (adsetId: string) => {
    setAdsetId(adsetId);
    setActiveTab(tabList[2]);
  };
  const handleAdCreation = (adId: string) => {};

  return (
    <div className="flex flex-col w-full h-full relative">
      <TabView
        setShowConfirmModal={setShowConfirmModal}
        items={tabList}
        activeAdTab={activeTab}
        setActiveAdTab={setActiveTab}
      />
      <div className="flex-1 overflow-hidden">
        {activeTab.id == 0 ? (
          <CampaignView
            accessToken={accessToken}
            onCampaignCreation={handleCampaignCreation}
            onCampaignSelection={handleCampaignCreation}
          />
        ) : activeTab.id == 1 ? (
          <AdsetView
            accessToken={accessToken}
            campaignId={campaignId}
            campaignObjective={campaignObjective}
            onAdsetCreation={handleAdsetCreation}
            onAdsetSelection={handleAdsetCreation}
          />
        ) : (
          <AdsView
            accessToken={accessToken}
            variant={variant}
            adsetId={adsetId}
            campaignId={campaignId}
            onAdCreation={handleAdCreation}
          />
        )}
      </div>
    </div>
  );
}
