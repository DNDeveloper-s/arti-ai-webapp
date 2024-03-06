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

interface Adset {
    id: string,
    name: string,
    optimization_goal: string,
    status: string,
    bid_strategy: string,
}


export default function ViewAdset({ campaignId, accessToken, onAdsetSelection }: { campaignId?: string, accessToken: string, onAdsetSelection: any }) {
    const [adsetList, setAdsetList] = useState<Adset[]>([])
    const [isLoading, setLoadingState] = useState(true)
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        const queryData = async () => {
            await delay(1000)
            initializeAdsetList();
        }

        queryData();
    }, []);

    async function initializeAdsetList() {
        setLoadingState(true)

        try {
            const { adAccountId, getAdAccountIdError } = await api.getAdAccountId(accessToken)

            if (getAdAccountIdError) {
                setErrorMessage(getAdAccountIdError)
                return;
            }

            const { data, getAdsetsError } = await api.getAdsets({
                campaignId: campaignId,
                accessToken: accessToken,
                accountId: adAccountId,
            });

            if (getAdsetsError) {
                setErrorMessage(getAdsetsError)
            } else {
                console.log(data)
                setAdsetList(data)
            }
        } finally {
            setLoadingState(false)
        }
    }

    return (
        <div>
            {isLoading ?
                <center><Loader /></center> :
                adsetList.length == 0 ?
                    <center>No Adsets Found!</center> :
                    <Table aria-label="">
                        <TableHeader>
                            <TableColumn>Status</TableColumn>
                            <TableColumn>ID</TableColumn>
                            <TableColumn>Name</TableColumn>
                            <TableColumn>Optimization Goal</TableColumn>
                            <TableColumn>Action</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {adsetList.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell><SwitchComponent checked={item.status == "ACTIVE"} onChange={() => { }} /></TableCell>
                                    <TableCell><button className='underline text-blue-600' onClick={() => onAdsetSelection(item.id)}>{item.id}</button></TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.optimization_goal}</TableCell>
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