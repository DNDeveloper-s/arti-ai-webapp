import { useState } from "react";
import api from "../api/arti_api";
import ActionButton from "./ActionButton";
import SwitchComponent from "./SwitchComponent";

export default function CreateAdset({ accessToken, campaignId, onAdsetCreation }: { accessToken: string, campaignId: string, onAdsetCreation: any }) {
    const [name, updateName] = useState("");
    const [optimizationGoal, updateOptimizationGoal] = useState("NONE");
    const [billingEvent, updateBillingEvent] = useState("IMPRESSIONS");
    const [status, updateStatus] = useState("ACTIVE")
    const [bidAmount, updateBidAmount] = useState(0)
    const [dailyBudget, updateDailyBudget] = useState(0)
    const [isLoading, setLoadingState] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [country, updateCountry] = useState("")

    const [countriesMap, updateCountries] = useState()

    // useEffect(() => {
    //     const queryData = async () => {
    //         console.log('query data')
    //         const response = await api.getAllCountries()
    //         if (response.data) {
    //             console.log(response.data)
    //             updateCountries(response.data);
    //         }

    //     }

    //     queryData();
    // }, []);


    const handleNameUpdate = (e: any) => {
        updateName(e.target.value);
    }
    const handleBidUpdate = (e: any) => {
        updateBidAmount(e.target.value);
    }
    const handleDailyBudgetUpdate = (e: any) => {
        updateDailyBudget(e.target.value);
    }
    const handleBillingEventDropdownChange = (e: any) => {
        updateBillingEvent(e.target.value);
    }
    const handleOptimizationGoalChange = (e: any) => {
        updateOptimizationGoal(e.target.value);
    }
    const handleCountryChange = (e: any) => {
        updateCountry(e.target.value);
    }
    const handleSwitchChange = (e: any) => {
        updateStatus(e ? "ACTIVE" : "PAUSED")
    }

    const getBillingEventList = (optimizationGoal: string) => {
        switch (optimizationGoal) {
            case "THRUPLAY":
                return [{ "name": "Thruplay", "value": "THRUPLAY" }, { "name": "Impressions", "value": "IMPRESSIONS" }]
            case "LINK_CLICKS":
                return [{ "name": "Link Clicks", "value": "LINK_CLICKS" }, { "name": "Impressions", "value": "IMPRESSIONS" }]
            default:
                return [{ "name": "Impressions", "value": "IMPRESSIONS" }]
        }
    }

    const handleSubmit = async () => {
        setLoadingState(true)

        try {
            const { adAccountId, getAdAccountIdError } = await api.getAdAccountId(accessToken)
            if (getAdAccountIdError) {
                setErrorMessage(getAdAccountIdError)
                return;
            }

            const adSet = {
                name: name,
                dailyBudget: dailyBudget * 100,
                bidAmount: bidAmount * 100,
                billingEvent: billingEvent,
                optimizationGoal: optimizationGoal,
                campaignId: campaignId,
                status: status,
            }

            const { adSetId, createAdSetError } = await api.createAdSet(adSet, adAccountId, accessToken, "IN");

            console.log(createAdSetError)

            if (createAdSetError) {
                setErrorMessage(createAdSetError)
                return;
            } else {
                onAdsetCreation(adSetId);
            }
        } finally {
            setLoadingState(false)
        }
    }


    return <>
        <div className="flex flex-col p-6 rounded-lg bg-white mb-4 text-black">
            <p className="text-black font-bold text-2xl mb-6">Create Adset</p>
            <input className="border-slate-500 border placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 p-2 text-black rounded-lg" placeholder="Adset Name" onChange={handleNameUpdate} />

            <input className="border-slate-500 border placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 p-2 text-black rounded-lg mt-2" type="number" placeholder="Daily Budget" onChange={handleDailyBudgetUpdate} />

            <input className="border-slate-500 border placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 p-2 text-black rounded-lg mt-2" type="number" placeholder="Bid Amount" onChange={handleBidUpdate} />

            <div className="border-slate-500 border placeholder-slate-400 p-2 text-black rounded-lg mt-2">
                <label htmlFor="dropdown">Optimization Goal:</label>
                <select id="dropdown" name="dropdown" onChange={handleOptimizationGoalChange} className="border-0 outline-0">
                    <option value="">None</option>
                    <option value="APP_INSTALLS">App Installs</option>
                    <option value="AD_RECALL_LIFT">Ad Recall Lift</option>
                    <option value="ENGAGED_USERS">Engaged Users</option>
                    <option value="EVENT_RESPONSES">Event Responses</option>
                    <option value="IMPRESSIONS">Impressions</option>
                    <option value="LEAD_GENERATION">Lead Generation</option>
                    <option value="LINK_CLICKS">Link Clicks</option>
                    <option value="OFFSITE_CONVERSIONS">Offsite Conversions</option>
                    <option value="PAGE_LIKES">Page Likes</option>
                    <option value="POST_ENGAGEMENT">Post Engagement</option>
                    <option value="REACH">Reach</option>
                    <option value="LANDING_PAGE_VIEWS">Landing Page Views</option>
                    <option value="VALUE">Value</option>
                    <option value="THRUPLAY">ThruPlay</option>
                    <option value="SOCIAL_IMPRESSIONS">Social Impressions</option>
                </select>
            </div>
            <div className="border-slate-500 border placeholder-slate-400 p-2 text-black rounded-lg mt-2">
                <label htmlFor="dropdown">Billing Event:</label>
                <select id="dropdown" name="dropdown" onChange={handleBillingEventDropdownChange} className="border-0 outline-0">
                    {getBillingEventList(optimizationGoal).map((item, index) => (
                        <option key={index} value={item.value}>{item.name}</option>
                    ))}
                </select>
            </div>
            {countriesMap ? <div className="border-slate-500 border placeholder-slate-400 p-2 text-black rounded-lg mt-2">
                <label htmlFor="dropdown">Select Country:</label>
                <select id="dropdown" name="dropdown" onChange={handleCountryChange} className="border-0 outline-0">
                    {Object.keys(countriesMap).map((item, index) => (
                        <option key={index} value={item}>{countriesMap[item]["country"]}</option>
                    ))}
                </select>
            </div> : <></>}

            <div />

            <div className="border-slate-500 placeholder-slate-400 p-2 text-black mt-2 flex space-x-4">
                <label>Status:</label>
                <div className='flex flex-col items-center'>
                    <SwitchComponent checked={status == "ACTIVE"} onChange={handleSwitchChange} />
                    <p className='font-bold text-xs'> {status}</p>
                </div>
            </div>
            {errorMessage ? <p className='mt-4 text-red-700 align-middle text-sm'>{errorMessage}</p> : <></>}
            <ActionButton isLoading={isLoading} normalText="Create Adset" loadingText="Creating..." handleSubmit={handleSubmit} />
        </div>
    </>
}