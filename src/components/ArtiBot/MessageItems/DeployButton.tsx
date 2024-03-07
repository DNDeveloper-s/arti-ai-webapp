import { IAdVariant } from "@/interfaces/IArtiBot";
import { GrDeploy } from 'react-icons/gr';
import { useSession } from 'next-auth/react';
import axios, { AxiosError } from 'axios';
import { ROUTES } from "@/config/api-config";
import React, { useContext, useState } from 'react';
import Snackbar from '@/components/Snackbar';
import { SnackbarContext } from '@/context/SnackbarContext';
import { signIn } from 'next-auth/react';
import { usePathname } from 'next/navigation'
import Modal from "@/components/Modal";
import DeployPostLayout from "./Deploy/Post/DeployPostLayout";
import DeployAdLayout from "./Deploy/Ad/DeployAdLayout";

enum UserChoice {
    post,
    ad,
}

export default function DeployButton({ variant }: { variant: IAdVariant }) {
    const { data: session, status } = useSession();
    const [snackBarData, setSnackBarData] = useContext(SnackbarContext).snackBarData;
    const pathName = usePathname()
    const [showModal, setShowModal] = useState(false)
    const [userChoice, setUserChoice] = useState(UserChoice.ad)
    const [accessToken, setUserAccessToken] = useState('')

    const handleUserChoice = async (choice: UserChoice) => {
        if (!session || !session.user) {
            setSnackBarData({ message: "Invalid Session", status: "error" });
            return;
        }

        try {
            const response = await axios.get(ROUTES.USERS.ACCOUNTS(session.user.id))
            const facebookAccounts = response.data.filter(c => c.provider === 'facebook');
            if(facebookAccounts.length === 0) {
                setSnackBarData({ message: "No Facebook account found", status: "error" });
                return;
            }
            const userAccessToken = facebookAccounts[0].access_token

            if (!userAccessToken) {
                setSnackBarData({ message: "Access token was invalid", status: "error" });
                await signIn('facebook', { callbackUrl: pathName });
                return;
            }

            setUserAccessToken(userAccessToken)
            setUserChoice(choice);
            setShowModal(true);
        } catch (e: any) {
            console.log(e.response)
        }
    }

    return (
        <>
            <button onClick={() => { handleUserChoice(UserChoice.post) }} className='cursor-pointer text-white hover:scale-105 fill-white text-sm flex justify-center gap-2 items-center bg-gray-800 border border-gray-500 rounded py-1.5 px-4 hover:bg-gray-700 transition-all'>
                <GrDeploy className='fill-white stroke-white [&>path]:stroke-white' />
                <span>Deploy Post</span>
            </button>
            <button onClick={() => { handleUserChoice(UserChoice.ad) }} className='cursor-pointer text-white hover:scale-105 fill-white text-sm flex justify-center gap-2 items-center bg-gray-800 border border-gray-500 rounded py-1.5 px-4 hover:bg-gray-700 transition-all'>
                <GrDeploy className='fill-white stroke-white [&>path]:stroke-white' />
                <span>Deploy Ad</span>
            </button>
            <Modal PaperProps={{ className: 'bg-black bg-opacity-90 p-6 w-[800px] h-[600px]' }} handleClose={() => setShowModal(false)} open={showModal}>
                {userChoice === UserChoice.ad ? <DeployAdLayout variant={variant} accessToken={accessToken} /> : <DeployPostLayout accessToken={accessToken} variant={variant} />}
            </Modal>
            <Snackbar />
        </>
    );
}