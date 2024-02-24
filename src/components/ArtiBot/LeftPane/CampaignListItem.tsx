import { IAdCreative } from '@/interfaces/IAdCreative';
import React, {FC, useEffect, useState} from 'react';
import Link from 'next/link';
import {getConversationURL} from '@/helpers';
import {ConversationType} from '@/interfaces/IConversation';
import {useParams} from 'next/navigation';
import useAdCreatives from '@/hooks/useAdCreatives';
import {CardStackImages, ImageType} from '@/components/ArtiBot/LeftPane/ConversationListItem';

interface CampaignListItemProps {
    conversationId: string;
}

const CampaignListItem: FC<CampaignListItemProps> = ({conversationId}) => {
    const params = useParams();
    const {getLastAdCreativeByConversationId} = useAdCreatives();
    const [images, setImages] = useState<ImageType[]>([]);
    const isActive = params.conversation_id === conversationId;

    useEffect(() => {
        const list = getLastAdCreativeByConversationId(conversationId);
        const variantImages = list.variants.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map(v => v.imageUrl);
        setImages(variantImages);
    }, [getLastAdCreativeByConversationId, conversationId]);

    return (
      <Link href={getConversationURL(conversationId, ConversationType.AD_CREATIVE) + '?ad_creative=expand'} key={conversationId} className={'flex flex-col gap-4 px-4 mx-2 py-3 hover:bg-gray-900 bg-gray-950 rounded text-gray-300 cursor-pointer overflow-hidden transition-all text-sm leading-6'}>
          <div className="flex gap-4 items-start ">
            <CardStackImages images={images} />
            <span className={'truncate'}>{getLastAdCreativeByConversationId(conversationId)?.adObjective}</span>
          </div>
          <div className='grid grid-cols-[2fr_3fr_3fr] gap-3'>
            <div className='flex gap-1 flex-shrink-0 flex-col'>
                <span className='font-bold text-base'>64</span>
                <p className='text-[10px] leading-[15px] max-w-[60px] text-gray-400 whitespace-pre-wrap'>Website Contacts</p>
            </div>
            <div className='flex gap-1 flex-shrink-0 flex-col'>
                <span className='font-bold text-base'>$10.83</span>
                <p className='text-[10px] leading-[15px] max-w-[60px] text-gray-400 whitespace-pre-wrap'>Cost per Website Contact</p>
            </div>
            <div className='flex gap-1 flex-shrink-0 flex-col'>
                <span className='font-bold text-base'>$693.06</span>
                <p className='text-[10px] leading-[15px] max-w-[60px] text-gray-400 whitespace-pre-wrap'>Spent</p>
            </div>
          </div>
      </Link>
    )
}

export default CampaignListItem;
