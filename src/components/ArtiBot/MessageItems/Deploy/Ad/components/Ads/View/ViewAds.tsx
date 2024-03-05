import { useEffect, useState } from "react";
import api from "../../../api/arti_api";
import Loader from '@/components/Loader';

const delay = (delay: number) => new Promise((res) => {
    setTimeout(res, delay)
})

interface Adset {
    id: string,
    name: string,
    optimization_goal: string,
    status: string,
    bid_strategy: string,
}


export default function ViewAds({ adsetId, accessToken }: { adsetId?: string, accessToken: string }) {
    const [adsList, setAdsList] = useState<Adset[]>([])
    const [isLoading, setLoadingState] = useState(true)
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        const queryData = async () => {
            await delay(1000)
            initializeAdsList();
        }

        queryData();
    }, []);

    async function initializeAdsList() {
        setLoadingState(true)

        try {
            const { adAccountId, getAdAccountIdError } = await api.getAdAccountId(accessToken)

            if (getAdAccountIdError) {
                setErrorMessage(getAdAccountIdError)
                return;
            }

            const { data, getAdsError } = await api.getAds({
                adsetId: undefined,
                accessToken: accessToken,
                accountId: adAccountId,
            });

            if (getAdsError) {
                setErrorMessage(getAdsError)
            } else {
                console.log(data)
                setAdsList(data)
            }
        } finally {
            setLoadingState(false)
        }
    }

    return (
        <div>
            {isLoading ?
                <center> <Loader /></center> :
                adsList.length == 0 ? <center>No Ads Found! </center> :
                    adsList.map((e) => <div key={e.id}>{e.name}</div>)}
        </div>
    );

}