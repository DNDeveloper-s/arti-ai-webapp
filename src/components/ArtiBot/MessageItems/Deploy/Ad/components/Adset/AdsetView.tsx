import { useEffect, useState } from "react";
import ActionButton from "../ActionButton";
import CreateAdset from "./Create/CreateAdset";
import ViewAdset from "./View/ViewAdset";
import ViewCampaign from "./View/ViewAdset";



export default function AdsetView({ accessToken, campaignId, onAdsetCreation, onAdsetSelection }: { accessToken: string, campaignId?: string, onAdsetCreation: any, onAdsetSelection: any }) {
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
                <p className="text-white font-bold text-2xl">{isInCreateMode ? 'Create Adset' : 'Adsets'}</p>
                {!isInCreateMode && campaignId ? <p className="text-xs bg-blue-300 text-black rounded-lg px-4 py-1">Selected Campaign: <b>{campaignId}</b></p> : <></>}
                {!isInCreateMode && campaignId ? <button onClick={onCreateButtonTap} className="flex p-2 bg-green-600 rounded-lg hover:bg-green-700 justify-center items-center text-sm" type="button">Create</button> : <></>}
            </div>
            {isInCreateMode ? <CreateAdset accessToken={accessToken} onAdsetCreation={onAdsetCreation} campaignId={campaignId} /> : <ViewAdset campaignId={campaignId} accessToken={accessToken} onAdsetSelection={onAdsetSelection} />}
        </div>

    </>
}