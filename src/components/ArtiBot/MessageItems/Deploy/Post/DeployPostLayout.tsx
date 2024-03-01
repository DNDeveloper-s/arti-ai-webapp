import { SnackbarContext } from '@/context/SnackbarContext';
import { useContext, useEffect, useState, } from "react";
import CreatePostView from './components/CreatePostView';
import axios from 'axios';
import { ROUTES } from '@/config/api-config';
import { IAdVariant } from '@/interfaces/IArtiBot';
import Loader from '@/components/Loader';

interface FacebookPage {
    id: string,
    name: string,
    access_token: string,
}

export default function DeployPostLayout({ accessToken, variant }: { accessToken: string, variant: IAdVariant }) {

    const [isLoadingPages, setLoadingPages] = useState(false)
    const [snackBarData, setSnackBarData] = useContext(SnackbarContext).snackBarData;
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const [pagesData, setPagesData] = useState<FacebookPage[]>([])
    const [selectedPage, selectPage] = useState<FacebookPage | null>()

    async function getUserPages() {
        selectPage(null)
        console.log(`token for get all pages: ${accessToken}`)
        try {
            if (isLoadingPages) return;
            setLoadingPages(true)
            const response = await axios.get(ROUTES.SOCIAL.GET_ALL_PAGES, {
                params: {
                    access_token: accessToken,
                }
            });

            setPagesData(response.data.data)
        } catch (error: any) {
            setSnackBarData({ status: 'error', message: error.response.data.message });
        } finally {
            setLoadingPages(false)
        }
    }

    useEffect(() => {
        getUserPages()
    }, []);

    return (
        <>
            <div className="flex justify-between content-center">
                <p className="font-bold text-2xl">Select A Page</p>
                <button className="px-8 bg-green-600 text-white rounded-md" onClick={getUserPages}>{isLoadingPages ? <Loader /> : "Refresh"}</button>
            </div>
            <div className='mt-8 flex items-start'>
                {pagesData ? pagesData.map((item, index) => {
                    return <button key={item.id} onClick={() => selectPage(item)}>
                        <div className={`flex rounded-md ${item.id == selectedPage?.id ? 'bg-slate-600' : 'bg-slate-300'} p-2  pr-8`}>
                            <div className="rounded-md py-2 px-4 bg-slate-500 font-bold text-2xl text-white mr-4" >{item.name[0]}</div>
                            <div className="flex flex-col items-start">
                                <p className={`font-bold ${item.id == selectedPage?.id ? 'text-white' : 'text-black'}`}>{item.name}</p>
                                <p className={`${item.id == selectedPage?.id ? 'text-slate-300' : 'text-slate-800'} text-xs`}>{item.id}</p>
                            </div>
                        </div> </button>
                }) : <p></p>}
                {selectedPage ? <CreatePostView selectedVariant={variant} pageId={selectedPage.id} pageAccessToken={selectedPage.access_token} /> : <></>}
            </div>
        </>
    );
}