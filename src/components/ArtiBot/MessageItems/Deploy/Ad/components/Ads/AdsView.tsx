import { IAdVariant } from "@/interfaces/IArtiBot";
import { useEffect, useState } from "react";
import ActionButton from "../ActionButton";
import CreateAd from "./Create/CreateAd";
import CreateAdset from "./Create/CreateAdset";
import ViewAds from "./View/ViewAds";
import ViewCampaign from "./View/ViewAds";

export default function AdsView({ accessToken, adsetId, campaignId, onAdCreation, variant }: { accessToken: string, adsetId?: string, campaignId?: string, onAdCreation: any, variant: IAdVariant }) {
    const [isInCreateMode, setCreateMode] = useState(false)

    const onCreateButtonTap = () => {
        setCreateMode(true)
    }

    const onBackButtonTap = () => {
        setCreateMode(false)
    }

    return <>
        <div className="flex flex-col p-6 rounded-lg bg-black text-white">
            <div className={`flex items-center ${isInCreateMode ? "justify-start" : "justify-between"}`}>
                {isInCreateMode ? <button onClick={onBackButtonTap} className="flex p-2 bg-green-600 rounded-lg hover:bg-green-700 justify-center items-center text-sm mr-4" type="button">Go Back</button> : <></>}
                <p className="text-white font-bold text-2xl">{isInCreateMode ? 'Create Ads' : 'Ads'}</p>
                {!isInCreateMode && adsetId ? <p className="text-xs bg-blue-300 text-black rounded-lg px-4 py-1">Selected Adset: <b>{adsetId}</b></p> : <></>}
                {!isInCreateMode && adsetId ? <button onClick={onCreateButtonTap} className="flex p-2 bg-green-600 rounded-lg hover:bg-green-700 justify-center items-center text-sm" type="button">Create</button> : <></>}
            </div>
            {isInCreateMode ? <CreateAd accessToken={accessToken} onAdCreation={onAdCreation} campaignId={campaignId!} adsetId={adsetId!} variant={variant} /> : <ViewAds accessToken={accessToken} adsetId={adsetId} />}
        </div>

    </>
}