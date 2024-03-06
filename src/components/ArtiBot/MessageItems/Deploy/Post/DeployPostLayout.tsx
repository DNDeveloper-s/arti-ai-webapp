import { SnackbarContext } from '@/context/SnackbarContext';
import { useContext, useEffect, useState, } from "react";
import CreatePostView from './components/CreatePostView';
import axios from 'axios';
import { ROUTES } from '@/config/api-config';
import { IAdVariant } from '@/interfaces/IArtiBot';
import Loader from '@/components/Loader';
import ViewUserPosts from './components/View/ViewUserPosts';
import { MdArrowBackIos, MdEmail } from 'react-icons/md';

interface FacebookPage {
    id: string,
    name: string,
    access_token: string,
}
const delay = (delay: number) => new Promise((res) => {
    setTimeout(res, delay)
})
export default function DeployPostLayout({ accessToken, variant }: { accessToken: string, variant: IAdVariant }) {

    const [isLoadingPages, setLoadingPages] = useState(false)
    const [snackBarData, setSnackBarData] = useContext(SnackbarContext).snackBarData;
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const [pagesData, setPagesData] = useState<FacebookPage[]>([])
    const [selectedPage, selectPage] = useState<FacebookPage | null>()
    const [isInCreateMode, setIsInCreateMode] = useState<boolean>(false)

    async function getUserPages() {
        selectPage(null)
        console.log(`token for get all pages: ${accessToken}`)
        try {
            if (isLoadingPages) return;
            setLoadingPages(true)
            const response = await axios.get(ROUTES.SOCIAL.PAGES, {
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

    const onPageButtonClick = async ({ page }: { page: FacebookPage }) => {
        selectPage(null)
        setIsInCreateMode(false)
        await delay(100)
        selectPage(page)
    }

    const handleActionButtonClick = async () => {
        if (selectedPage) {
            setIsInCreateMode(true)
        } else {
            getUserPages();
        }
    }


    useEffect(() => {
        getUserPages()
    }, []);

    return (
        <>
            <div className='overflow-scroll h-[500px]'>
                <div className="flex justify-between content-center">
                    <div className='flex items-center'>
                        {isInCreateMode ? <button onClick={() => setIsInCreateMode(false)}><MdArrowBackIos style={{ fontSize: '21px' }} /></button> : <></>}
                        <span className="font-bold text-2xl">{isInCreateMode ? "Create Post" : "Select A Page"}</span>
                    </div>
                    {isInCreateMode ? <></> : <button className="px-8 bg-green-600 text-white rounded-md" onClick={handleActionButtonClick}>{isLoadingPages ? <Loader /> : selectedPage ? "Create Post" : "Refresh"}</button>}

                </div>
                <div className='mt-8 flex items-start'>
                    <div className='flex flex-col'>
                        {pagesData ? pagesData.map((item, index) => {
                            return <button key={item.id} onClick={() => onPageButtonClick({ page: item })}>
                                <div className={`flex rounded-md ${item.id == selectedPage?.id ? 'bg-primary' : 'bg-slate-300'} p-2 mb-2 pr-8`}>
                                    <div className="rounded-md py-2 px-4 bg-slate-500 font-bold text-2xl text-white mr-4" >{item.name[0]}</div>
                                    <div className="flex flex-col items-start">
                                        <p className={`font-bold ${item.id == selectedPage?.id ? 'text-white' : 'text-black'}`}>{item.name}</p>
                                        <p className={`${item.id == selectedPage?.id ? 'text-slate-300' : 'text-slate-800'} text-xs`}>{item.id}</p>
                                    </div>
                                </div> </button>
                        }) : <p></p>}
                    </div>
                    {selectedPage ? isInCreateMode ? <CreatePostView pageId={selectedPage.id} pageAccessToken={selectedPage.access_token} selectedVariant={variant} /> : <ViewUserPosts pageId={selectedPage.id} pageAccessToken={selectedPage.access_token} /> : <></>}
                </div>
            </div>
        </>
    );
}