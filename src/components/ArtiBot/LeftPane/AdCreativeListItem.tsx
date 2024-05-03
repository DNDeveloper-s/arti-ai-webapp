import { IAdCreative, IAdCreativeNew } from "@/interfaces/IAdCreative";
import React, { FC, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getConversationURL } from "@/helpers";
import { ConversationType } from "@/interfaces/IConversation";
import { useParams } from "next/navigation";
import useAdCreatives from "@/hooks/useAdCreatives";
import {
  CardStackImages,
  ImageType,
} from "@/components/ArtiBot/LeftPane/ConversationListItem";
import { IAdVariant } from "@/interfaces/IArtiBot";
import { random, sortBy } from "lodash";

const DummyProjectName = "Thi si muy caamdsf asdlfj lasjdfkl asjdf";

export function AdCreativeListItemShimmer() {
  const projectName = useMemo(() => {
    return DummyProjectName.slice(0, random(15, 23));
  }, []);

  return (
    <div
      className={
        "animate-pulse flex flex-shrink-0 gap-4 px-4 mx-2 py-3 hover:bg-gray-900 bg-gray-950 rounded text-gray-300 cursor-pointer overflow-hidden transition-all text-sm leading-6"
      }
    >
      <CardStackImages images={[]} />
      <div>
        <span className={"app-shimmer rounded truncate"}>{projectName}</span>
      </div>
    </div>
  );
}

interface AdCreativeListItemProps {
  conversationId: string;
  variants: IAdVariant[];
  adCreative: IAdCreativeNew;
  containerClassName?: string;
}
const AdCreativeListItem: FC<AdCreativeListItemProps> = ({
  conversationId,
  variants,
  adCreative,
  containerClassName,
}) => {
  const params = useParams();
  const [images, setImages] = useState<ImageType[]>([]);
  const isActive = params.conversation_id === conversationId;

  useEffect(() => {
    const variantImages = sortBy(variants, "updatedAt").map((v) => v.imageUrl);
    setImages(variantImages);
  }, [variants]);

  return (
    <Link
      href={
        getConversationURL(conversationId, ConversationType.AD_CREATIVE) +
        "&ad_creative=expand"
      }
      key={conversationId}
      className={
        "flex gap-4 items-start px-4 py-3 mx-2 hover:bg-gray-900 rounded text-gray-300 cursor-pointer overflow-hidden transition-all text-sm leading-6 " +
        (isActive ? "bg-gray-900 " : "bg-gray-950 ") +
        (containerClassName ?? "")
      }
    >
      <CardStackImages images={images} />
      <span className={isActive ? "text-white" : " truncate"}>
        {adCreative.adObjective}
      </span>
    </Link>
  );
};
export default AdCreativeListItem;
