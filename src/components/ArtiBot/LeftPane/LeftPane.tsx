'use client';

import CTAButton from '@/components/CTAButton';
import { getAdCreatives, getConversations, useConversation } from '@/context/ConversationContext';
import { getConversationURL } from '@/helpers';
import useAdCreatives from '@/hooks/useAdCreatives';
import useConversations from '@/hooks/useConversations';
import useSessionToken from '@/hooks/useSessionToken';
import { ConversationType } from '@/interfaces/IConversation';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { FC, useEffect } from 'react';
import { BiSolidEdit } from 'react-icons/bi';
import { MdArrowBackIos } from 'react-icons/md';

interface LeftPaneProps {

}

const LeftPane: FC<LeftPaneProps> = (props) => {
    const router = useRouter();
    const {conversations, isConversationLoading, getConversationById} = useConversations();
    const {adVariantsByConversationId, getLastAdCreativeByConversationId, sortedConversationIds} = useAdCreatives();
	const {state, dispatch} = useConversation();
	const token = useSessionToken();
    const params = useParams();
    const search = useSearchParams();

	useEffect(() => {
		token && dispatch && getConversations(dispatch);
		token && dispatch && getAdCreatives(dispatch);
	}, [dispatch, token]);
    
    return (
        <div className='flex flex-col w-[250px]'>
            <div className="w-full flex items-center cursor-pointer px-4 py-6" onClick={() => router.push('/')}>
                <MdArrowBackIos style={{fontSize: '21px'}}/>
                <span className="ml-0.5 -mb-0.5 text-white text-opacity-60">Dashboard</span>
            </div>
            <hr className='border-gray-700' />
            <Link href={'/artibot'} className='block w-full my-3' prefetch={true}>
                <button className='mx-auto py-2 px-4 flex gap-2 text-sm items-center breathing-button-primary bg-primary rounded'>
                    <BiSolidEdit />
                    <span>New Conversation</span>
                </button>
            </Link>
            <hr className='border-gray-700' />
            <div className='w-full my-4'>
                <div className='px-4 text-sm font-bold text-gray-400'>
                    <h3>Conversations</h3>
                </div>
                <div className='mt-2'>
                    {conversations && sortedConversationIds.map((conversationId) => {
                        const isActive = params.conversation_id === conversationId;
                        return (
                            <Link href={getConversationURL(conversationId, ConversationType.AD_CREATIVE)} key={conversationId} className={'block px-4 py-2 text-gray-200 cursor-pointer transition-all text-sm leading-6 ' + (isActive ? 'text-primary' : ' truncate')}>
                                <span>Ad Creative | {getConversationById(conversationId)?.project_name}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>
            <hr className='border-gray-700' />
            <div className='w-full my-4'>
                <div className='px-4 text-sm font-bold text-gray-400'>
                    <h3>Ad Creatives</h3>
                </div>
                <div className='mt-2'>
                    {sortedConversationIds.map((conversationId: string) => {
                        const isActive = params.conversation_id === conversationId && search.get('ad_creative') === 'expand';
                        return (
                            <Link href={getConversationURL(conversationId, ConversationType.AD_CREATIVE) + '?ad_creative=expand'} key={conversationId} className={'block px-4 py-2 text-gray-200 cursor-pointer transition-all text-sm leading-6 ' + (isActive ? 'text-primary' : ' truncate')}>
                                <span>{getLastAdCreativeByConversationId(conversationId)?.adObjective}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default LeftPane;