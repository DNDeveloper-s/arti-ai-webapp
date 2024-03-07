import { SnackbarContext } from '@/context/SnackbarContext';
import { IAdVariant } from "@/interfaces/IArtiBot";
import { useContext, useEffect, useState, } from "react";
import axios, { AxiosError } from 'axios';
import { ROUTES } from '@/config/api-config';
import { getNextImageProxyUrl } from '@/helpers';


export default function CreatePostView({ selectedVariant, pageId, pageAccessToken }: { selectedVariant: IAdVariant, pageId: string, pageAccessToken: string }) {

    const [errorMessage, setErrorMessage] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [snackBarData, setSnackBarData] = useContext(SnackbarContext).snackBarData;

    let isImageReady = imageUrl && imageUrl.length > 0

    const createPost = async () => {
        try {
            if (isLoading) return;
            setLoading(true)
            const response = await axios.post(ROUTES.SOCIAL.POSTS, {
                post: {
                    url: getNextImageProxyUrl(isImageReady ? imageUrl : selectedVariant.imageUrl!),
                    message: selectedVariant.text,
                },
                page_id: pageId,
                page_access_token: pageAccessToken,
            });

            if (response.status === 200) {
                setSnackBarData({ status: 'success', message: "Your post was published successfully." });
            }
        } catch (error: any) {
            setSnackBarData({ status: 'error', message: error.response.data.message });
        } finally {
            setLoading(false)
        }
    }

    const onImageUrlChange = (e: any) => {
        setImageUrl(e.target.value)
    }

    useEffect(() => {
        setImageUrl(selectedVariant.imageUrl!)
    }, [imageUrl])

    return <>
        <div className="flex flex-col p-6 rounded-lg bg-white ml-4 text-black items-center justify-center content-center">
            {selectedVariant ?
                <div>
                    <input className="mb-2 border border-black-200 p-2 w-[400px]" placeholder="Enter image URL" onChange={onImageUrlChange} />
                    <img className="mb-1 rounded-md h-[200px] w-[200px]" src={isImageReady ? imageUrl : selectedVariant.imageUrl!}></img>
                    <p className="mb-4">{selectedVariant.text}</p>
                    <p className="text-red-500 text-xs">{errorMessage}</p>
                    <button className="bg-blue-500 text-white text p-3 rounded-md w-full mt-1" onClick={createPost}>{isLoading ? 'Posting...' : 'Post'}</button>
                </div>
                : <p>Select a variant!</p>}
        </div>
    </>
}