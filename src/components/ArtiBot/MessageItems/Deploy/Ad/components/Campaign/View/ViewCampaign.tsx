import { useEffect, useState } from "react";
import api from "../../../api/arti_api";
import Loader from '@/components/Loader';
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell
} from "@nextui-org/react";
import { RxExit } from 'react-icons/rx';
import SwitchComponent from "../../SwitchComponent";

const delay = (delay: number) => new Promise((res) => {
    setTimeout(res, delay)
})

interface Campaign {
    id: string,
    name: string,
    objective: string,
    status: string,
}


export default function ViewCampaign({ accessToken, onCampaignSelection }: { accessToken: string, onCampaignSelection: any }) {
    const [campaignList, setCampaignList] = useState<Campaign[]>([])
    const [isLoading, setLoadingState] = useState(true)
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        const queryData = async () => {
            setCampaignList([]);
            await delay(1000)
            initializeCampaignList();
        }

        queryData();
    }, []);

    async function initializeCampaignList() {
        setLoadingState(true)

        try {
            const { adAccountId, getAdAccountIdError } = await api.getAdAccountId(accessToken)

            if (getAdAccountIdError) {
                setErrorMessage(getAdAccountIdError)
                return;
            }

            const { data, getAllCampaignsError } = await api.getAllCampaigns(adAccountId!, accessToken);

            if (getAllCampaignsError) {
                setErrorMessage(getAllCampaignsError)
            } else {
                setCampaignList(data)
            }
        } finally {
            setLoadingState(false)
        }
    }

    return (
        <div className={'flex-1 overflow-auto'}>
            {isLoading ?
                <center><Loader /></center> :
                campaignList.length == 0 ?
                    "No Campaigns Found!" :
                    <Table aria-label="">
                        <TableHeader>
                            <TableColumn>Status</TableColumn>
                            <TableColumn>ID</TableColumn>
                            <TableColumn>Name</TableColumn>
                            <TableColumn>Objective</TableColumn>
                            <TableColumn>Action</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {campaignList.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell><SwitchComponent checked={item.status == "ACTIVE"} onChange={() => { }} /></TableCell>
                                    <TableCell><button className='underline text-blue-600' onClick={() => { onCampaignSelection(item.id, item.objective) }}>{item.id}</button></TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.objective}</TableCell>
                                    <TableCell>
                                        <div className="flex">
                                            <RxExit className="cursor-pointer text-primary" style={{ fontSize: '24px' }} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>}
        </div>
    );
}
