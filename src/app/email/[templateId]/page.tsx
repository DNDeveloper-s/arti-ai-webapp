'use client'

import { useState, useContext } from 'react';
import Snackbar from '@/components/Snackbar';
import axios from 'axios';
import { SnackbarContext } from '@/context/SnackbarContext';
import { ROUTES } from '@/config/api-config';
import { useParams } from '../../../../node_modules/next/navigation';

export default function Email() {
    const MAILGUN_API_KEY = "cb3aeda539a3d1575f9c8c0bb5a8edf3 - 915161b7-d8a128be"
    const MAILGUN_DOMAIN = "error.pustack.com"
    const MAILCHIMP_API_KEY = "c52432d6515be87c12245200cf5bce4d - us18"
    const MAILCHIMP_REGION = "us18"

    const [snackBarData, setSnackBarData] = useContext(SnackbarContext).snackBarData;

    const [subject, setSubject] = useState('');
    const [title, setCampaignTitle] = useState('');
    const [from, setFrom] = useState('');

    const params = useParams();
    const templateId = params.templateId as string

    const [campaignId, setCampaignId] = useState('')

    const createCampaign = async () => {
        try {
            // Setting up the campaign data
            const data = {
                "subject": subject,
                "title": title,
                "from": from,
                "template_id": parseInt(templateId)
            };

            // Creating the campaign
            const response = await axios.post(ROUTES.ADS.MAILCHIMP_CAMPAIGNS, data, {
                headers: { 'Authorization': `apiKey ${MAILCHIMP_API_KEY}` }
            });

            if (response.status === 200) {
                setCampaignId(response.data.data);
                setSnackBarData({
                    message: "Campaign has been created!",
                    status: "success",
                })
            } else {
                setSnackBarData({
                    message: "An error occurred",
                    status: "error",
                })
            }
        } catch (e: any) {
            console.log(e)
            setSnackBarData({
                message: "An error occurred",
                status: "error",
            })
        }
    }

    const sendCampaign = async () => {
        try {
            // Setting up the campaign data
            const data = {
                "campaign_id": campaignId
            };

            // Creating the campaign
            const response = await axios.post(ROUTES.ADS.SEND_CAMPAIGN, data, {
                headers: { 'Authorization': `apiKey ${MAILCHIMP_API_KEY}` }
            });

            if (response.status === 200) {
                setSnackBarData({
                    message: "Campaign has been scheduled!",
                    status: "success",
                })
            } else {
                setSnackBarData({
                    message: "An error occurred...",
                    status: "error",
                })
            }
        } catch (e: any) {
            console.log(e)
            setSnackBarData({
                message: e.response.data.message,
                status: "error",
            })
        }
    }

    const handleSubjectChange = (e: any) => { setSubject(e.target.value) }
    const handleCampaignTitleChange = (e: any) => { setCampaignTitle(e.target.value) }
    const handleFromChange = (e: any) => { setFrom(e.target.value) }

    return <div className="h-full p-10">
        <div className="flex flex-col items-center">
            Create Campaign

            <input className="mb-2 text-black" onChange={handleSubjectChange} placeholder='Enter Subject for Email' />
            <input className="mb-2 text-black" onChange={handleCampaignTitleChange} placeholder='Enter Campaign Title' />
            <input className="mb-2 text-black" onChange={handleFromChange} placeholder='From' />

            <button onClick={createCampaign}>Create Campaign</button>
            {campaignId ? <button onClick={sendCampaign}>Send Campaign</button> : <></>}
        </div>

        <Snackbar />
    </div>
}
