import { useContext, useEffect, useState } from "react";
import api from "../api/arti_api";
import ActionButton from "./ActionButton";
import SwitchComponent from "./SwitchComponent";
import axios from 'axios';
import { SnackbarContext } from '@/context/SnackbarContext';
import { ROUTES } from "@/config/api-config";


const delay = (delay: number) => new Promise((res) => {
    setTimeout(res, delay)
})

interface UserInterest {
    id: string,
    name: string,
    type: string,
    path: any[],
    audience_size_lower_bound: number,
    audience_size_upper_bound: number,
    description?: string,
}

export default function CreateAdset({ accessToken, campaignId, onAdsetCreation }: { accessToken: string, campaignId: string, onAdsetCreation: any }) {
    const [name, updateName] = useState("");
    const [optimizationGoal, updateOptimizationGoal] = useState("NONE");
    const [billingEvent, updateBillingEvent] = useState("IMPRESSIONS");
    const [status, updateStatus] = useState("ACTIVE")
    const [bidAmount, updateBidAmount] = useState(0)
    const [dailyBudget, updateDailyBudget] = useState(0)
    const [isLoading, setLoadingState] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [adAccountId, setAdAccountId] = useState("")
    const [audienceList, setAudienceList] = useState()
    const [selectedAudienceId, setAudienceId] = useState('')
    const [interestList, setInterestList] = useState<UserInterest[]>([])
    const [selectedInterestList, setSelectedInterestList] = useState<UserInterest[]>([])
    const [country, updateCountry] = useState("")
    const [startTime, updateStartTime] = useState<Date>()
    const [endTime, updateEndTime] = useState<Date>()
    const [snackBarData, setSnackBarData] = useContext(SnackbarContext).snackBarData;

    const [countriesMap, updateCountries] = useState()

    useEffect(() => {
        const queryData = async () => {
            await delay(1000)
            queryCountries();
            setInterestList([]);

            const adAccountId = await queryAdAccountId();
            if (adAccountId) {
                queryAudiences(adAccountId)
            }

        }

        queryData();
    }, [])


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
    const handleAudienceChange = (e: any) => {
        setAudienceId(e.target.value)
    }

    // const handleStartDateTimeChange = (e: any) => {
    //     new Date(e.target.value)
    // }

    async function queryAudiences(adAccountId: string) {
        try {
            const response = await axios.get(ROUTES.ADS.CUSTOM_AUDIENCE, {
                params: {
                    account_id: adAccountId,
                    access_token: accessToken,
                }
            });

            setAudienceId(response.data.data[0].id);
            setAudienceList(response.data.data)
        } catch (error: any) {
            console.log(error)
            setSnackBarData({ status: 'error', message: error.response.data.message });
        } finally { }
    }

    async function queryCountries() {
        try {
            const response = await axios.get(ROUTES.ADS.GET_ALL_COUNTRIES);
            updateCountry(Object.keys(response.data.data)[0])
            updateCountries(response.data.data);
        } catch (error: any) {
            console.log(error)
            setSnackBarData({ status: 'error', message: error.response.data.message });
        } finally { }
    }

    async function queryAdAccountId() {
        try {
            const { adAccountId, getAdAccountIdError } = await api.getAdAccountId(accessToken)
            if (getAdAccountIdError) {
                setErrorMessage(getAdAccountIdError)
                return;
            }
            setAdAccountId(adAccountId)
            return adAccountId;
        } catch (error: any) {
            setSnackBarData({ status: 'error', message: error.response.data.message });
            return null;
        } finally { }
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

    const getAppropriateSpec = () => {
        const output = selectedInterestList.reduce((acc: any, curr) => {
            if (curr.type === 'interests') {
                acc[0].interests.push({ id: curr.id, name: curr.name });
            } else if (curr.type === 'behaviors') {
                acc[0].behaviors.push({ id: curr.id, name: curr.name });
            } else if (curr.type === 'work_employers') {
                acc[0].work_employers.push({ id: curr.id, name: curr.name });
            } else if (curr.type === 'work_positions') {
                acc[0].work_positions.push({ id: curr.id, name: curr.name });
            }
            return acc;
        }, [{ interests: [], behaviors: [], work_employers: [], work_positions: [] }]);

        return output;
    }

    const handleSubmit = async () => {
        setLoadingState(true)

        try {

            const adSet: any = {
                name: name,
                daily_budget: dailyBudget * 100,
                bid_amount: bidAmount * 100,
                billing_event: billingEvent,
                optimization_goal: optimizationGoal,
                campaign_id: campaignId,
                start_time: startTime,
                end_time: endTime,
                targeting: {
                    "device_platforms": [
                        "mobile"
                    ],
                    "facebook_positions": [
                        "feed"
                    ],
                    "geo_locations": {
                        "countries": [
                            country,
                        ]
                    },
                    "publisher_platforms": [
                        "facebook",
                        "audience_network"
                    ],
                },
                status: status,
            }

            if (selectedAudienceId) {
                adSet.targeting["custom_audiences"] = [{ "id": selectedAudienceId }]
            }

            if (selectedInterestList) {
                adSet.targeting.flexible_spec = getAppropriateSpec()
            }


            adSet.promoted_object = {
                "application_id": "645064660474863",
                "object_store_url": "http://www.facebook.com/gaming/play/645064660474863/"
            }


            const { adSetId, createAdSetError } = await api.createAdSet(adSet, adAccountId, accessToken);

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

    const queryInterests = async (e: any) => {
        const query = e.target.value;
        if (query.length === 0) return;
        try {
            const response = await axios.get(ROUTES.ADS.INTERESTS, {
                params: {
                    account_id: adAccountId,
                    access_token: accessToken,
                    query: query,
                }
            },);
            setSelectedInterestList([]);
            console.log(response.data.data)
            setInterestList(response.data.data)
        } catch (error: any) {
            setSnackBarData({ status: 'error', message: error.response.data.message });
        }
    }

    const handleInterestSelection = (item: UserInterest) => {
        setSelectedInterestList([...selectedInterestList, item]);
        // if (selectedInterestList.some(e => e.id === item.id)) {
        //     const index = selectedInterestList.findIndex((e) => e.id === item.id)
        //     selectedInterestList.splice(index, 1)
        //     console.log('after removing')
        //     console.log(selectedInterestList)
        //     setSelectedInterestList(selectedInterestList);
        // } else {
        //     console.log('after adding')
        //     console.log(selectedInterestList)
        //     setSelectedInterestList([...selectedInterestList, item]);
        // }
    }

    return <>
        <div className="flex flex-col p-6 rounded-lg bg-white mb-4 text-black h-[580px] overflow-scroll">
            <p className="text-black font-bold text-2xl mb-6">Create Adset</p>
            <input className="border-slate-500 border placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 p-2 text-black rounded-lg" placeholder="Adset Name" onChange={handleNameUpdate} />

            <input className="border-slate-500 border placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 p-2 text-black rounded-lg mt-2" type="number" placeholder="Daily Budget" onChange={handleDailyBudgetUpdate} />

            <input className="border-slate-500 border placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 p-2 text-black rounded-lg mt-2" type="number" placeholder="Bid Cap" onChange={handleBidUpdate} />

            <div className="flex mt-2 mb-2">
                <div className="flex flex-col mr-4">
                    <label>Start Time</label>
                    <input type="datetime-local" onChange={e => updateStartTime(new Date(e.target.value))} className="border-slate-500 border placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 p-2 text-black rounded-lg mt-2"></input>
                </div>
                <div className="flex flex-col">
                    <label>End Time</label>
                    <input type="datetime-local" onChange={e => updateEndTime(new Date(e.target.value))} className="border-slate-500 border placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 p-2 text-black rounded-lg mt-2"></input>
                </div>
            </div>

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
            {audienceList ? <div className="border-slate-500 border placeholder-slate-400 p-2 text-black rounded-lg mt-2">
                <label htmlFor="dropdown">Custom Audience:</label>
                <select id="dropdown" name="dropdown" onChange={handleAudienceChange} className="border-0 outline-0">
                    {audienceList.map((item, index) => (
                        <option key={index} value={item.id}>{item.name}</option>
                    ))}
                </select>
            </div> : <></>}
            {countriesMap ? <div className="border-slate-500 border placeholder-slate-400 p-2 text-black rounded-lg mt-2">
                <label htmlFor="dropdown">Select Country:</label>
                <select id="dropdown" name="dropdown" onChange={handleCountryChange} className="border-0 outline-0">
                    {Object.keys(countriesMap).map((item, index) => (
                        <option key={index} value={item}>{countriesMap[item]["country"]}</option>
                    ))}
                </select>
            </div> : <></>}
            <input className="border-slate-500 border placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 p-2 text-black rounded-lg mt-2" placeholder="Add demographics, interest or behaviours" onChange={queryInterests} />
            {interestList.length != 0 ?
                <div className="flex">
                    {interestList.map((item, index) => (
                        <button key={index} className={`flex flex-col rounded-md p-2 mr-2 mt-4 ${selectedInterestList.some(e => e.id === item.id) ? 'bg-blue-500' : 'bg-blue-300'}`} onClick={(_) => handleInterestSelection(item)}>
                            <span className={`text-xs font-bold md-2 ${selectedInterestList.some(e => e.id === item.id) ? 'text-white' : 'text-black '}`}>{item.type}</span>
                            <span className={`text-xs md-2 ${selectedInterestList.some(e => e.id === item.id) ? 'text-white' : 'text-black'}`}>{item.name}</span>
                        </button>
                    ))}
                </div>
                : <></>}
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