import { ClientMessageItem, InfiniteMessage } from "@/api/conversation";
import { useCurrentConversation } from "@/context/CurrentConversationContext";
import {
  IAdCreativeWithVariants,
  IAdVariantClient,
} from "@/interfaces/IAdCreative";
import { ConversationType } from "@/interfaces/IConversation";
import { useMemo, useRef } from "react";
import { ConversationAdVariant } from "./ConversationAdVariant";
import ClientAdVariant from "../ClientState/ClientAdVariant";
import { DeployAdInsightsCard } from "../../MessageItems/Insights/DeployAdInsightsCard";
import useInView from "@/hooks/useInView";
import { useConversation } from "@/context/ConversationContext";
import { useGetAdSet } from "@/api/user";
import { ConversationAdVariantWithPostInsights } from "../../MessageItems/AdItem";

interface AdItemPropsWithClient {
  messageItem: ClientMessageItem;
  variantFontSize?: number;
  isClient: true;
}

interface AdItemPropsWithoutClient {
  messageItem: InfiniteMessage;
  variantFontSize?: number;
  isClient: false;
}

type AdItemProps = AdItemPropsWithClient | AdItemPropsWithoutClient;

export default function AdItem({
  messageItem,
  variantFontSize,
  isClient,
}: AdItemProps) {
  const { state } = useConversation();
  // const json = messageItem.json && JSON.parse(messageItem.json) as AdJSONInput;
  const adCreative = messageItem.adCreatives && messageItem.adCreatives[0];
  const { conversation } = useCurrentConversation();
  const { ref: containerRef, isInView } = useInView({ timeInView: 1000 });
  const adset = state.adset.findOneBy("adCreativeId", adCreative?.id ?? "");
  const { data, isLoading, isSuccess } = useGetAdSet({
    adsetId: adset?.adsetId,
    enabled: isInView,
  });

  const isAdCreativeInState = state.adCreative.findOneBy(
    "id",
    messageItem.adCreatives?.[0]?.id ?? ""
  );

  //   if (!adCreative || !currentConversation) return null;
  if (!adCreative || !conversation) return null;

  const str = `<div class="">
          <div>
              <p class="text-white text-opacity-50 font-diatype text-[0.85em] leading-[1.75em] my-[0.4em]">Congratulations! We have
                  successfully generated the ad for you. To explore different ad variants and make the best choice, simply
                  navigate to the right pane and switch between tabs.</p>
          </div>
          <div class="mt-[0.67em]">
              <span class="font-semibold text-primary text-[1.1em]">Ad Summary</span>
              <p
                  class="text-white text-opacity-80 font-diatype text-[0.9em] leading-[1.75em] my-[0.55em]"><!-- Insert your JSON data here -->${adCreative.summary}</p>
          </div>
          <div class="border-t border-gray-600 pt-3 mt-5">
              <ul class="list-disc px-4">
                  <li class="text-white text-opacity-50 font-diatype text-[0.85em] leading-[1.75em] my-2">If you find the current
                      advertisement unsatisfactory, please feel free to share additional information with us. This will enable us to
                      create a better ad for you, and you can easily generate a new one by clicking the 'Regenerate Ad' button.
                  </li>
                  <li class="text-white text-opacity-50 font-diatype text-[0.85em] leading-[1.75em] my-2">Feel free to provide
                      feedback on each ad variant by visiting the "Provide Feedback" section on the right-hand side of the tab.
                  </li>
              </ul>
          </div>
      </div>`;

  return (
    <div ref={containerRef}>
      {/* <Markdown source={str} options={{html: true}} /> */}
      <div>
        <p className="text-white text-opacity-50 font-diatype text-[0.85em] leading-[1.75em] my-[0.4em]">
          Congratulations! We have successfully generated the ad for you. To
          explore different ad variants and make the best choice, simply
          navigate to the right pane and switch between tabs.
        </p>
      </div>
      <div className="mt-[1em]">
        <span className="font-semibold text-primary text-[1.1em]">
          Ad Summary
        </span>
        <p className="text-white text-opacity-80 font-diatype text-[0.9em] leading-[1.75em] my-[0.55em]">
          {adCreative.summary}
        </p>
      </div>
      <div className="flex w-full overflow-auto items-start gap-6 my-[2.5em]">
        {/* {!isAdCreativeInState &&
          messageItem.adCreatives &&
          messageItem.adCreatives[0]?.variants.map((variant) => (
            <ClientAdVariant
              key={variant.variantNo}
              variant={variant as IAdVariantClient}
            />
          ))} */}
        {messageItem.adCreatives && !isClient && (
          <>
            {conversation.conversation_type === ConversationType.AD_CREATIVE &&
              messageItem.adCreatives[0]?.variants.map((variant) => (
                <ConversationAdVariant
                  key={variant.id}
                  variantId={variant.id}
                  baseVariant={variant}
                />
              ))}
            {conversation.conversation_type ===
              ConversationType.SOCIAL_MEDIA_POST &&
              messageItem.adCreatives[0]?.variants.map((variant) => (
                <ConversationAdVariantWithPostInsights
                  key={variant.id}
                  variantId={variant.id}
                />
              ))}
          </>
        )}
      </div>
      <DeployAdInsightsCard isFetching={isLoading} adset={data} />
    </div>
  );
}
