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
import ConversationListItem from '@/components/ArtiBot/LeftPane/ConversationListItem';
import AdCreativeListItem from '@/components/ArtiBot/LeftPane/AdCreativeListItem';
import CampaignListItem from './CampaignListItem';

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

  useEffect(() => {
    console.log('mounted | Left Pane - ');
  }, [])
    
    return (
        <div className='flex flex-col w-[250px] h-full overflow-hidden'>
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
            <div className={'relative overflow-auto w-full'}>
              <div className='w-full my-4'>
                <div className='px-4 text-sm font-bold text-gray-400'>
                  <h3>Conversations</h3>
                </div>
                <div className='mt-2'>
                  {conversations && conversations.map((conversation) => <ConversationListItem key={conversation.id} conversationId={conversation.id} />)}
                </div>
              </div>
              <hr className='border-gray-700' />
              <div className='w-full my-4'>
                <div className='px-4 text-sm font-bold text-gray-400'>
                  <h3>Ad Creatives</h3>
                </div>
                <div className='mt-2'>
                  {sortedConversationIds.map((conversationId: string) => <AdCreativeListItem key={conversationId} conversationId={conversationId} />)}
                </div>
              </div>
              <hr className='border-gray-700' />
              <div className='w-full my-4'>
                <div className='px-4 text-sm font-bold text-gray-400'>
                  <h3>Campaigns</h3>
                </div>
                <div className='mt-2 flex flex-col gap-2'>
                  {sortedConversationIds.map((conversationId: string) => <CampaignListItem key={conversationId} conversationId={conversationId} />)}
                </div>
              </div>
            </div>
        </div>
    )
}

export default LeftPane;
