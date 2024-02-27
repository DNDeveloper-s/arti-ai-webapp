import { useConversation } from '@/context/ConversationContext';
import { IAdCreative } from '@/interfaces/IAdCreative';
import React, { useCallback, useMemo } from 'react';

export default function useAdCreatives() {
    const {state} = useConversation();

	// Merge the variants of adCreatives per conversationId
	const adVariantsByConversationId = useMemo(() => {
		if(!state.conversation.map || !state.adCreative.map) return {};
		return state.adCreative.list?.reduce((acc: Record<string, {list: IAdCreative[], updatedAt?: string}>, adCreative: IAdCreative) => {
			if(!acc[adCreative.conversationId]) {
				acc[adCreative.conversationId] = {
					list: []
				};
			}
			acc[adCreative.conversationId].list.push(adCreative);
			acc[adCreative.conversationId].updatedAt = state.conversation.map[adCreative.conversationId]?.lastAdCreativeCreatedAt;
			return acc;
		}, {} as Record<string, {list: IAdCreative[], updatedAt?: string}>) ?? {};
	}, [state.conversation.map, state.adCreative.map, state.adCreative.list])

	let sortedKeys: string[] = [];

	if(adVariantsByConversationId) {
		sortedKeys = Object.keys(adVariantsByConversationId).sort((a, b) => {
			if(!adVariantsByConversationId || !adVariantsByConversationId[a] || !adVariantsByConversationId[b]) return 0;
			if(!adVariantsByConversationId[a].updatedAt) return 1;
			if(!adVariantsByConversationId[b].updatedAt) return -1; 
			if((adVariantsByConversationId[a].updatedAt ?? 0) > (adVariantsByConversationId[b].updatedAt ?? 0)) return -1;
			if((adVariantsByConversationId[a].updatedAt ?? 0) < (adVariantsByConversationId[b].updatedAt ?? 0)) return 1;
			return 0;
		});
	}

    const getLastAdCreativeByConversationId = useCallback((conversationId: string) => {
        const val =  adVariantsByConversationId[conversationId]?.list?.reduce((acc: IAdCreative, current) => {
            if(!acc.updatedAt || current.updatedAt > acc.updatedAt) {
                acc = {
                    ...current,
                    variants: [...(acc.variants ?? []), ...(current.variants ?? [])]
                }
            } else {
                acc = {
                    ...acc,
                    variants: [...(acc.variants ?? []), ...(current.variants ?? [])]
                }
            }
            return acc;
        }, {} as IAdCreative);
				return val;
    }, [adVariantsByConversationId]);

    return {adVariantsByConversationId, sortedConversationIds: sortedKeys, getLastAdCreativeByConversationId};

}
