import { useGetVariantsByConversation } from "@/api/conversation";
import useInView from "@/hooks/useInView";
import { useEffect, useMemo, useRef, useState } from "react";
import AdCreativeCard, { AdCreativeCardShimmer } from "./AdCreativeCard";
import { Spinner } from "@nextui-org/react";
import Drawer, { Position } from "@/components/Drawer";
import RightPane from "@/components/ArtiBot/RIghtPane/v2/RightPane";
import {
  IAdCreativeNew,
  IAdCreativeWithVariants,
} from "@/interfaces/IAdCreative";
import { EmptySection, EmptySectionType } from "./CardSection";

export default function AdCreativeSection() {
  const { data, isLoading, hasNextPage, ...props } =
    useGetVariantsByConversation();
  const adCreatives = useMemo(
    () => data?.pages.map((page) => page).flat() || [],
    [data]
  );
  // const lastRef = useRef(null);
  const { ref: lastRef, isInView } = useInView();

  const [currentAdCreative, setCurrentAdCreative] =
    useState<IAdCreativeWithVariants | null>(null);

  useEffect(() => {
    if (isInView && !props.isFetching && hasNextPage) {
      props.fetchNextPage();
    }
  }, [isInView, props, hasNextPage]);

  const handleAdCreativeClick = (val: IAdCreativeWithVariants) => {
    setCurrentAdCreative(val);
  };

  const waiting = isLoading && adCreatives.length === 0;
  const empty = !waiting && adCreatives.length === 0;
  const notEmpty = !waiting && adCreatives.length > 0;

  if (empty) return null;

  return (
    <section className="mb-10 w-full">
      <h2 className="mb-3">Past Ad Creatives</h2>
      <div className="flex items-center gap-4 w-full overflow-x-auto">
        {waiting && (
          <div className="w-full flex gap-4 overflow-hidden">
            <AdCreativeCardShimmer />
            <AdCreativeCardShimmer />
            <AdCreativeCardShimmer />
          </div>
        )}
        {notEmpty &&
          adCreatives.map((obj) => (
            <AdCreativeCard
              key={obj.id}
              adCreative={obj.ad_creative}
              onClick={handleAdCreativeClick}
              {...obj}
            />
          ))}
        {hasNextPage && (
          <div
            className="w-[60px] p-0 pr-[20px] h-full flex items-center justify-center"
            ref={lastRef}
          >
            <Spinner />
          </div>
        )}
      </div>
      <Drawer
        open={!!currentAdCreative}
        position={Position.RIGHT}
        handelClose={() => setCurrentAdCreative(null)}
      >
        {currentAdCreative && <RightPane adCreative={currentAdCreative} />}
      </Drawer>
    </section>
  );
}
