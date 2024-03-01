
import { IAdVariant } from "@/interfaces/IArtiBot";
import { useState } from "react";
import CreateAd from "./components/CreateAd";
import CreateAdset from "./components/CreateAdset";
import CreateCampaign from "./components/CreateCampaign";
import TabView from "./components/TabView";

interface TabItem {
    id: number,
    name: string,
}

export default function DeployAdLayout({ accessToken, variant }: { accessToken: string, variant: IAdVariant }) {
    const tabList: TabItem[] = [
        { id: 0, name: 'Campaigns' },
        { id: 1, name: 'Ad Sets' },
        { id: 2, name: 'Ads' }
    ];

    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<TabItem>(tabList[0]);

    const [campaignId, setCampaignId] = useState('');
    const [adsetId, setAdsetId] = useState('');

    const handleCampaignCreation = (campaignId: string) => {
        setCampaignId(campaignId)
        setActiveTab(tabList[1])
    }
    const handleAdsetCreation = (adsetId: string) => {
        setAdsetId(adsetId)
        setActiveTab(tabList[2])
    }
    const handleAdCreation = (adId: string) => {

    }

    return <>
        <TabView setShowConfirmModal={setShowConfirmModal} items={tabList} activeAdTab={activeTab} setActiveAdTab={setActiveTab} />
        {
            activeTab.id == 0 ?
                <CreateCampaign accessToken={accessToken} onCampaignCreation={handleCampaignCreation} /> :
                activeTab.id == 1 ?
                    <CreateAdset accessToken={accessToken} campaignId={campaignId} onAdsetCreation={handleAdsetCreation} /> :
                    <CreateAd accessToken={accessToken} variant={variant} adsetId={adsetId} campaignId={campaignId} onAdCreation={handleAdCreation} />
        }
    </>
}