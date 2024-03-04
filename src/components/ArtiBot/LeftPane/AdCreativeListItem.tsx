import { IAdCreative } from '@/interfaces/IAdCreative';
import React, {FC, useEffect, useState} from 'react';
import Link from 'next/link';
import {getConversationURL} from '@/helpers';
import {ConversationType} from '@/interfaces/IConversation';
import {useParams} from 'next/navigation';
import useAdCreatives from '@/hooks/useAdCreatives';
import {CardStackImages, ImageType} from '@/components/ArtiBot/LeftPane/ConversationListItem';

interface AdCreativeListItemProps {
    conversationId: string;
}

const AdCreativeListItem: FC<AdCreativeListItemProps> = ({conversationId}) => {
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
      <Link href={getConversationURL(conversationId, ConversationType.AD_CREATIVE) + '&ad_creative=expand'} key={conversationId} className={'flex gap-4 items-start px-4 py-3 mx-2 hover:bg-gray-900 rounded text-gray-300 cursor-pointer overflow-hidden transition-all text-sm leading-6 ' + (isActive ? 'bg-gray-900' : 'bg-gray-950')}>
          <CardStackImages images={images} />
          <span className={(isActive ? 'text-white' : ' truncate')}>{getLastAdCreativeByConversationId(conversationId)?.adObjective}</span>
      </Link>
    )
}

export default AdCreativeListItem;
