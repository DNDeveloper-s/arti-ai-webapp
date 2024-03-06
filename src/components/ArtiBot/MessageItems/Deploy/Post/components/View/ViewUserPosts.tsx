import { SnackbarContext } from '@/context/SnackbarContext';
import { IAdVariant } from "@/interfaces/IArtiBot";
import { useContext, useEffect, useState, } from "react";
import axios, { AxiosError } from 'axios';
import { ROUTES } from '@/config/api-config';
import Loader from '@/components/Loader';

interface Like {
    id: string;
    name: string;
}

interface Cursors {
    before: string;
    after: string;
}

interface Paging {
    cursors: Cursors;
}

interface LikesData {
    data: Like[];
    paging: Paging;
}

interface Comment {
    created_time: string;
    from: {
        name: string;
        id: string;
    };
    message: string;
    id: string;
}

interface CommentsData {
    data: Comment[];
    paging: Paging;
}

interface Shares {
    count: number;
}

interface Post {
    full_picture: string;
    likes?: LikesData;
    comments?: CommentsData;
    shares?: Shares;
    created_time: string;
    message?: string;
    id: string;
}


const delay = (delay: number) => new Promise((res) => {
    setTimeout(res, delay)
})

export default function ViewUserPosts({ pageId, pageAccessToken }: { pageId: string, pageAccessToken: string }) {
    const [snackBarData, setSnackBarData] = useContext(SnackbarContext).snackBarData;
    const [isLoading, setLoadingState] = useState(true)

    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const queryData = async () => {
            await delay(1000)
            initializeData();
        }

        queryData();

    }, []);

    async function initializeData() {
        setLoadingState(true)

        try {
            const response = await axios.get(ROUTES.SOCIAL.POSTS, {
                params: {
                    page_id: pageId,
                    access_token: pageAccessToken,
                }
            });

            if (response.status == 200) {
                setPosts(response.data.data);
            }
        } catch (e: any) {
            console.log(e.response)
            setSnackBarData({
                message: "An error occurred!",
                status: "error"
            });
        } finally {
            setLoadingState(false)
        }
    }

    return <>
        <div className="flex flex-col p-6 rounded-lg bg-white ml-4 text-black">
            {isLoading ? <center><Loader /></center> : <></>}
            {posts.map((e, item) =>
                <div key={e.id} className="mb-2">
                    <img src={e.full_picture} height={120} width={120} className="rounded-lg mb-1" />
                    <p>{e.message}</p>
                    <div className='flex mt-2'>
                        <p className='mr-2'>Likes : {e.likes?.data.length ?? 0}</p>
                        <p className='mr-2'>Comments : {e.comments?.data.length ?? 0}</p>
                        <p>Shares : {e.shares?.count ?? 0}</p>
                    </div>
                </div>)}
        </div>
    </>
}