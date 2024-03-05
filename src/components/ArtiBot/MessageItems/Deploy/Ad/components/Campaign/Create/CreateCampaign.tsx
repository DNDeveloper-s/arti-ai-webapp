import { useState } from "react";
import api from "../../../api/arti_api";
import ActionButton from "../../ActionButton";
import SwitchComponent from "../../SwitchComponent";

export default function CreateCampaign({ accessToken, onCampaignCreation }: { accessToken: string, onCampaignCreation: any }) {
    const [name, updateName] = useState("");
    const [objective, updateObjective] = useState("OUTCOME_AWARENESS");
    const [status, updateStatus] = useState("ACTIVE")
    const [isLoading, setLoadingState] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [startDate, setStartDate] = useState(new Date());

    const handleNameUpdate = (e: any) => {
        updateName(e.target.value)
    }

    const handleDropdownChange = (e: any) => {
        updateObjective(e.target.value)
    }

    const handleSwitchChange = (e: Boolean) => {
        updateStatus(e ? "ACTIVE" : "PAUSED")
    }


    const handleSubmit = async () => {
        setLoadingState(true)

        try {
            const { adAccountId, getAdAccountIdError } = await api.getAdAccountId(accessToken)

            if (getAdAccountIdError) {
                setErrorMessage(getAdAccountIdError)
                return;
            }

            const campaign = {
                name: name,
                objective: objective,
                status: status,
            }

            const { campaignId, createCampaignError } = await api.createCampaign(campaign, adAccountId!, accessToken);

            if (createCampaignError) {
                setErrorMessage(createCampaignError)
            } else {
                onCampaignCreation(campaignId);
            }
        } finally {
            setLoadingState(false)
        }
    }


    return <>
        <div className="flex flex-col p-6 rounded-lg text-white">
            <input className="border-slate-500 border placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 p-2 rounded-lg mb-2 bg-black" placeholder="My Awesome Campaign" onChange={handleNameUpdate} />

            <div className="border-slate-500 border placeholder-slate-400 p-2 rounded-lg mt-2">
                <label htmlFor="dropdown">Campaign Objective:</label>
                <select id="dropdown" name="dropdown" onChange={handleDropdownChange} className="border-0 outline-0 bg-black">
                    <option value="OUTCOME_AWARENESS">Awareness</option>
                    <option value="OUTCOME_ENGAGEMENT">Engagement</option>
                    <option value="OUTCOME_LEADS">Leads</option>
                    <option value="OUTCOME_SALES">Sales</option>
                    <option value="OUTCOME_TRAFFIC">Traffic</option>
                    <option value="OUTCOME_APP_PROMOTION">App Promotion</option>
                </select>
            </div>


            <div className="border-slate-500 placeholder-slate-400 p-2 mt-2 flex space-x-4">
                <label>Status:</label>
                <div className='flex flex-col items-center'>
                    <SwitchComponent checked={status == "ACTIVE"} onChange={handleSwitchChange} />
                    <p className='font-bold text-xs'>{status}</p>
                </div>
            </div>
            {errorMessage ? <p className='mt-4 text-red-700 align-middle text-sm'>{errorMessage}</p> : <></>}
            <ActionButton isLoading={isLoading} normalText="Create Campaign" loadingText="Creating..." handleSubmit={handleSubmit} />
        </div>

    </>
}