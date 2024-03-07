import { useEffect, useState } from "react";
import ActionButton from "../ActionButton";
import CreateCampaign from "./Create/CreateCampaign";
import ViewCampaign from "./View/ViewCampaign";



export default function CampaignView({ accessToken, onCampaignCreation, onCampaignSelection }: { accessToken: string, onCampaignCreation: any, onCampaignSelection: any }) {
    const [isInCreateMode, setCreateMode] = useState(false)

    const onCreateCampaignTap = () => {
        setCreateMode(true)
    }

    const onBackButtonTap = () => {
        setCreateMode(false)
    }

    return <>
        <div className="flex overflow-hidden flex-col p-6 rounded-lg bg-black text-white h-full">
            <div className={`flex items-center ${isInCreateMode ? "justify-start" : "justify-between"}`}>
                {isInCreateMode ? <button onClick={onBackButtonTap} className="flex p-2 bg-green-600 rounded-lg hover:bg-green-700 justify-center items-center text-sm mr-4" type="button">Go Back</button> : <></>}
                <p className="text-white font-bold text-2xl">{isInCreateMode ? 'Create Campaign' : 'Campaigns'}</p>
                {!isInCreateMode ? <button onClick={onCreateCampaignTap} className="flex p-2 bg-green-600 rounded-lg hover:bg-green-700 justify-center items-center text-sm" type="button">Create</button> : <></>}
            </div>
            {isInCreateMode ? <CreateCampaign accessToken={accessToken} onCampaignCreation={onCampaignCreation} /> : <ViewCampaign accessToken={accessToken} onCampaignSelection={onCampaignSelection} />}
        </div>
    </>
}
