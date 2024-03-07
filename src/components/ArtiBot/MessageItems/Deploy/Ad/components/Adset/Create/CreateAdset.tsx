import { useContext, useEffect, useState } from "react";
import api from "../../../api/arti_api";
import ActionButton from "../../ActionButton";
import SwitchComponent from "../../SwitchComponent";
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

// Define the data object
interface Location {
    key: string,
    name: string,
    type: string,
    country_code: string,
    country_name: string,
    region: string,
    primary_city: string,
    region_id: number,
    primary_city_id: number,
    supports_region: boolean,
    supports_city: boolean
};

interface Country {
    code: string,
    name: string,
}

export default function CreateAdset({ accessToken, campaignId, campaignObjective, onAdsetCreation }: { accessToken: string, campaignId?: string, campaignObjective?: string, onAdsetCreation: any }) {
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
    const [zipcodeList, setZipcodeList] = useState<Location[]>([])

    const [selectedZipcodeList, setSelectedZipcodeList] = useState<Location[]>([])
    const [selectedInterestList, setSelectedInterestList] = useState<UserInterest[]>([])

    const [selectedCountry, updateSelectedCountry] = useState<Country>()
    const [selectedCountryList, updateSelectedCountryList] = useState<Country[]>([])
    const [countriesMap, updateCountries] = useState()

    const [startTime, updateStartTime] = useState<Date>()
    const [endTime, updateEndTime] = useState<Date>()
    const [snackBarData, setSnackBarData] = useContext(SnackbarContext).snackBarData;

    const [applicationId, setApplicationId] = useState()
    const [storeUrl, setStoreUrl] = useState()

    const getOptimizationList = () => {
        if (campaignObjective === 'OUTCOME_APP_PROMOTION') {
            return [
                { name: "App Installs", value: "APP_INSTALLS" },
                { name: "Impressions", value: "IMPRESSIONS" },
            ];
        }
        if (campaignObjective === 'OUTCOME_LEADS') {
            return [
                { name: "Impressions", value: "IMPRESSIONS" },
                { name: "Lead Generation", value: "LEAD_GENERATION" },
                { name: "Link Clicks", value: "LINK_CLICKS" },
                // { name: "Offsite Conversions", value: "OFFSITE_CONVERSIONS" },
                { name: "Reach", value: "REACH" },
                { name: "Landing Page Views", value: "LANDING_PAGE_VIEWS" },
            ];
        }
        if (campaignObjective === 'OUTCOME_ENGAGEMENT') {
            return [
                { name: "Impressions", value: "IMPRESSIONS" },
                { name: "Link Clicks", value: "LINK_CLICKS" },
                { name: "Page Likes", value: "PAGE_LIKES" },
                { name: "Post Engagement", value: "POST_ENGAGEMENT" },
                { name: "Reach", value: "REACH" },
                { name: "Landing Page Views", value: "LANDING_PAGE_VIEWS" },
            ];
        }
        return [];
    }


    const conversionEventType =
        [
            {
                "name": "Ad Impression",
                "value": "AD_IMPRESSION"
            },
            {
                "name": "Rate",
                "value": "RATE"
            },
            {
                "name": "Tutorial Completion",
                "value": "TUTORIAL_COMPLETION"
            },
            {
                "name": "Contact",
                "value": "CONTACT"
            },
            {
                "name": "Customize Product",
                "value": "CUSTOMIZE_PRODUCT"
            },
            {
                "name": "Donate",
                "value": "DONATE"
            },
            {
                "name": "Find Location",
                "value": "FIND_LOCATION"
            },
            {
                "name": "Schedule",
                "value": "SCHEDULE"
            },
            {
                "name": "Start Trial",
                "value": "START_TRIAL"
            },
            {
                "name": "Submit Application",
                "value": "SUBMIT_APPLICATION"
            },
            {
                "name": "Subscribe",
                "value": "SUBSCRIBE"
            },
            {
                "name": "Add to Cart",
                "value": "ADD_TO_CART"
            },
            {
                "name": "Add to Wishlist",
                "value": "ADD_TO_WISHLIST"
            },
            {
                "name": "Initiated Checkout",
                "value": "INITIATED_CHECKOUT"
            },
            {
                "name": "Add Payment Info",
                "value": "ADD_PAYMENT_INFO"
            },
            {
                "name": "Purchase",
                "value": "PURCHASE"
            },
            {
                "name": "Lead",
                "value": "LEAD"
            },
            {
                "name": "Complete Registration",
                "value": "COMPLETE_REGISTRATION"
            },
            {
                "name": "Content View",
                "value": "CONTENT_VIEW"
            },
            {
                "name": "Search",
                "value": "SEARCH"
            },
            {
                "name": "Service Booking Request",
                "value": "SERVICE_BOOKING_REQUEST"
            },
            {
                "name": "Messaging Conversation Started (7D)",
                "value": "MESSAGING_CONVERSATION_STARTED_7D"
            },
            {
                "name": "Level Achieved",
                "value": "LEVEL_ACHIEVED"
            },
            {
                "name": "Achievement Unlocked",
                "value": "ACHIEVEMENT_UNLOCKED"
            },
            {
                "name": "Spent Credits",
                "value": "SPENT_CREDITS"
            },
            {
                "name": "Listing Interaction",
                "value": "LISTING_INTERACTION"
            },
            {
                "name": "(D2) Retention",
                "value": "D2_RETENTION"
            },
            {
                "name": "(D7) Retention",
                "value": "D7_RETENTION"
            },
            {
                "name": "Other",
                "value": "OTHER"
            }
        ];

    useEffect(() => {
        const queryData = async () => {
            await delay(1000)
            queryCountries();
            setInterestList([]);
            setZipcodeList([]);

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
        updateSelectedCountry({
            code: e.target.value,
            name: countriesMap![e.target.value]['country'],
        })
    }
    const handleSwitchChange = (e: any) => {
        updateStatus(e ? "ACTIVE" : "PAUSED")
    }
    const handleAudienceChange = (e: any) => {
        setAudienceId(e.target.value)
    }

    const handleCountrySelection = () => {
        if (!selectedCountry) {
            setSnackBarData({ message: "Please select a country", status: "error" })
            return;
        }

        if (!selectedCountryList.includes(selectedCountry)) {
            updateSelectedCountryList([...selectedCountryList, selectedCountry])
        }
    }

    const removeSelectedCountry = (country: Country) => {
        // const oldSelectedCountryList = selectedCountryList;
        // oldSelectedCountryList.splice(oldSelectedCountryList.indexOf(country))
        updateSelectedCountryList(selectedCountryList.filter(c => c != country))
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
            console.log('querying countries')
            const response = await axios.get(ROUTES.ADS.GET_ALL_COUNTRIES);
            const countryCode = Object.keys(response.data.data)[0]

            updateSelectedCountry({
                code: countryCode,
                name: response.data.data![countryCode]['country'],
            })
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

    const getBillingEventList = () => {
        return [{ "name": "Impressions", "value": "IMPRESSIONS" }]
        // switch (optimizationGoal) {
        //     case "THRUPLAY":
        //         return [{ "name": "Thruplay", "value": "THRUPLAY" }, { "name": "Impressions", "value": "IMPRESSIONS" }]
        //     case "LINK_CLICKS":
        //         return [{ "name": "Link Clicks", "value": "LINK_CLICKS" }, { "name": "Impressions", "value": "IMPRESSIONS" }]
        //     default:
        //         return [{ "name": "Impressions", "value": "IMPRESSIONS" }]
        // }
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

    function convertToRegionId(input: Location[]) {
        return input.map(item => ({ key: item.region_id }));
    }

    const handleSubmit = async () => {

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
                    "publisher_platforms": [
                        "facebook",
                        "audience_network"
                    ],
                },
                status: status,
            }

            if (selectedAudienceId) {

            }

            if (selectedInterestList) {
                adSet.targeting.flexible_spec = getAppropriateSpec()
            }

            if (selectedCountryList) {
                if (!adSet.targeting["geo_locations"]) {
                    adSet.targeting["geo_locations"] = {};
                }
                adSet.targeting["geo_locations"]["countries"] = selectedCountryList.map(item => item.code);
            }

            if (selectedZipcodeList) {
                if (!adSet.targeting["geo_locations"]) {
                    adSet.targeting["geo_locations"] = {};
                }
                adSet.targeting["geo_locations"]["regions"] = convertToRegionId(selectedZipcodeList);
            }

            if (campaignObjective === "OUTCOME_APP_PROMOTION") {
                if (applicationId && storeUrl) {
                    // "promoted_object": {
                    //     "application_id": "645064660474863",
                    //     "object_store_url": "http://www.facebook.com/gaming/play/645064660474863/"
                    //   }
                    adSet.promoted_object = {
                        "application_id": applicationId,
                        "object_store_url": storeUrl
                    }
                } else {
                    setSnackBarData({ status: "error", message: "Please provide an application id and store url" })
                    return;
                }
            } else if (campaignObjective === "OUTCOME_LEADS") {


            } else if (campaignObjective === "OUTCOME_ENGAGEMENT") {

            }

            setLoadingState(true)

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
            setInterestList(response.data.data)
        } catch (error: any) {
            setSnackBarData({ status: 'error', message: error.response.data.message });
        }
    }

    const queryZipCodes = async (e: any) => {
        const query = e.target.value;
        if (query.length === 0) return;
        try {
            const response = await axios.get(ROUTES.LOCATION.ZIPCODE, {
                params: {
                    zip_code: query,
                    access_token: accessToken,
                }
            },);
            setSelectedZipcodeList([]);
            setZipcodeList(response.data.data)
        } catch (error: any) {
            console.log(error.response.data)
            setSnackBarData({ status: 'error', message: error.response.data.message });
        }
    }

    const handleZipcodeSelection = (item: Location) => {
        setSelectedZipcodeList([...selectedZipcodeList, item]);
    }


    const handleInterestSelection = (item: UserInterest) => {
        setSelectedInterestList([...selectedInterestList, item]);
    }

    return <>
        <div className="flex flex-col p-6 rounded-lg mb-4 h-[580px] overflow-scroll">
            <input className="border-slate-500 border placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 p-2 bg-black rounded-lg" placeholder="Adset Name" onChange={handleNameUpdate} />

            <input className="border-slate-500 border placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 p-2 bg-black rounded-lg mt-2" type="number" placeholder="Daily Budget" onChange={handleDailyBudgetUpdate} />

            <input className="border-slate-500 border placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 p-2 bg-black rounded-lg mt-2" type="number" placeholder="Bid Cap" onChange={handleBidUpdate} />

            <div className="flex mt-2 mb-2">
                <div className="flex flex-col mr-4">
                    <label>Start Time</label>
                    <input type="datetime-local" onChange={e => updateStartTime(new Date(e.target.value))} className="border-slate-500 border placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 p-2 bg-black rounded-lg mt-2"></input>
                </div>
                <div className="flex flex-col">
                    <label>End Time</label>
                    <input type="datetime-local" onChange={e => updateEndTime(new Date(e.target.value))} className="border-slate-500 border placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 p-2 bg-black rounded-lg mt-2"></input>
                </div>
            </div>

            <div className="border-slate-500 border placeholder-slate-400 p-2  rounded-lg mt-2">
                <label htmlFor="dropdown">Optimization Goal:</label>
                <select id="dropdown" name="dropdown" onChange={handleOptimizationGoalChange} className="border-0 outline-0 bg-black">
                    {getOptimizationList().map((item, index) => (
                        <option key={index} value={item.value}>{item.name}</option>
                    ))}
                </select>
            </div>
            <div className="border-slate-500 border placeholder-slate-400 p-2  rounded-lg mt-2">
                <label htmlFor="dropdown">Billing Event:</label>
                <select id="dropdown" name="dropdown" onChange={handleBillingEventDropdownChange} className="border-0 outline-0 bg-black">
                    {getBillingEventList().map((item, index) => (
                        <option key={index} value={item.value}>{item.name}</option>
                    ))}
                </select>
            </div>
            {audienceList ? <div className="border-slate-500 border placeholder-slate-400 p-2  rounded-lg mt-2">
                <label htmlFor="dropdown">Custom Audience:</label>
                <select id="dropdown" name="dropdown" onChange={handleAudienceChange} className="border-0 outline-0 bg-black">
                    {audienceList.map((item, index) => (
                        <option key={index} value={item.id}>{item.name}</option>
                    ))}
                </select>
            </div> : <></>}
            {countriesMap ? <div className="border-slate-500 border placeholder-slate-400 p-2  rounded-lg mt-2 bg-black">
                <div className="flex">
                    <label htmlFor="dropdown">Select Country:</label>
                    <select id="dropdown" name="dropdown" onChange={handleCountryChange} className="border-0 bg-black outline-0">
                        {Object.keys(countriesMap).map((item, index) => (
                            <option key={index} value={item}>{countriesMap[item]["country"]}</option>
                        ))}
                    </select>
                    <button onClick={handleCountrySelection} className="ml-4 bg-green-700 text-white text-sm px-2 rounded-md">Add Country</button>
                </div>
            </div> : <></>}
            {selectedCountryList.length != 0 ?
                <div className="flex">
                    {selectedCountryList.map((item, index) => (
                        <button key={index} className={`flex rounded-md p-2 mr-2 mt-1 bg-blue-500 align-center bg-black`}>
                            <span className={`text-xs font-bold md-2 text-white`}>{item.name}, {item.code}</span>
                            <button onClick={() => removeSelectedCountry(item)}><div className="bg-blue-700 text-xs ml-2 rounded-lg text-white px-1">x</div></button>
                        </button>
                    ))}
                </div>
                : <></>}
            <input className="border-slate-500 border placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 p-2 bg-black rounded-lg mt-2" placeholder="Zip Codes" onChange={queryZipCodes} />
            {zipcodeList.length != 0 ?
                <div className="flex">
                    {zipcodeList.map((item, index) => (
                        <button key={index} className={`flex flex-col rounded-md p-2 mr-2 mt-4 ${selectedZipcodeList.some(e => e.key === item.key) ? 'bg-blue-500' : 'bg-blue-300'}`} onClick={(_) => handleZipcodeSelection(item)}>
                            <span className={`text-xs font-bold md-2 ${selectedZipcodeList.some(e => e.key === item.key) ? 'text-white' : ' '}`}>{item.country_code} {item.country_name}</span>
                            <span className={`text-xs font-bold md-2 ${selectedZipcodeList.some(e => e.key === item.key) ? 'text-white' : ' '}`}>{item.name} {item.primary_city} {item.region_id}</span>
                        </button>
                    ))}
                </div>
                : <></>}
            <input className="border-slate-500 border placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 p-2 bg-black rounded-lg mt-2" placeholder="Add demographics, interest or behaviours" onChange={queryInterests} />
            {interestList.length != 0 ?
                <div className="flex">
                    {interestList.map((item, index) => (
                        <button key={index} className={`flex flex-col rounded-md p-2 mr-2 mt-4 ${selectedInterestList.some(e => e.id === item.id) ? 'bg-blue-500' : 'bg-blue-300'}`} onClick={(_) => handleInterestSelection(item)}>
                            <span className={`text-xs font-bold md-2 ${selectedInterestList.some(e => e.id === item.id) ? 'text-white' : ' '}`}>{item.type}</span>
                            <span className={`text-xs md-2 ${selectedInterestList.some(e => e.id === item.id) ? 'text-white' : ''}`}>{item.name}</span>
                        </button>
                    ))}
                </div>
                : <></>}
            <div />

            {campaignObjective === 'OUTCOME_APP_PROMOTION' ?
                <div className="flex flex-col">
                    <input type="text" placeholder="Application Id" onChange={(e: any) => setApplicationId(e.target.value)} className="border-slate-500 border placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 p-2 bg-black rounded-lg mt-2"></input>
                    <input type="text" placeholder="Store URL" onChange={(e: any) => setStoreUrl(e.target.value)} className="border-slate-500 border placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 p-2 bg-black rounded-lg mt-2"></input>
                </div> :
                // campaignObjective === 'OUTCOME_LEADS' ? <div>Leads</div> :
                //     campaignObjective === 'OUTCOME_ENGAGEMENT' ? <div>Engagement</div> :
                <></>
            }


            <div className="border-slate-500 placeholder-slate-400 p-2  mt-2 flex space-x-4">
                <label>Status:</label>
                <div className='flex flex-col items-center'>
                    <SwitchComponent checked={status == "ACTIVE"} onChange={handleSwitchChange} />
                    <p className='font-bold text-xs'> {status}</p>
                </div>
            </div>
            {errorMessage ? <p className='mt-4 text-red-700 align-middle text-sm'>{errorMessage}</p> : <></>}
            <ActionButton isLoading={isLoading} normalText='Create Adset' loadingText="Creating..." handleSubmit={handleSubmit} />
        </div>
    </>
}