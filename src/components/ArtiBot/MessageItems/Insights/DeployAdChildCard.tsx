import { useGetAds } from "@/api/user";
import { useTimeRange } from "@/context/TimeRangeContext";
import { Collapse, CollapseProps } from "antd";
import { useMemo } from "react";
import AdTitle from "./AdTitle";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import InsightCard from "./InsightCard";
import { Spinner } from "@nextui-org/react";
import { BiCaretRight } from "react-icons/bi";
import { LoadMoreButton } from "../../LeftPane/LeftPane";

interface DeployAdChildCardProps {
  isActive: boolean;
  adsetId: string;
  accountId?: string;
}
export const DeployAdChildCard = ({
  isActive,
  adsetId,
  accountId,
}: DeployAdChildCardProps) => {
  const { timeRange } = useTimeRange();
  const {
    data: adPages,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isLoading,
  } = useGetAds({
    adsetIds: [adsetId],
    enabled: isActive,
    accountId: accountId,
    timeRange,
    get_leads: true,
  });

  const ads = useMemo(
    () => adPages?.pages.map((page) => page.data).flat(),
    [adPages]
  );

  const adItemsNest: CollapseProps["items"] = useMemo(() => {
    return (
      ads?.map((ad) => {
        return {
          key: ad.id,
          label: <AdTitle ad={ad} ad_account_id={accountId} />,
          children: (
            <ErrorBoundary errorComponent={ErrorComponent}>
              <div className="flex flex-col gap-4">
                {ad.insights && ad.insights?.data[0] ? (
                  <InsightCard show={true} insights={ad.insights?.data[0]} />
                ) : (
                  <div className="flex items-center justify-center">
                    <p className="text-xs opacity-40">
                      No insights available for this ad.
                    </p>
                  </div>
                )}
              </div>
            </ErrorBoundary>
          ),
        };
      }) ?? []
    );
  }, [ads, accountId]);

  return (
    <>
      {isLoading && (
        <div className="w-full flex gap-2 items-center justify-center text-xs">
          <Spinner label="Loading Ads" />
        </div>
      )}
      <div className="flex flex-col gap-4">
        <Collapse
          defaultActiveKey="1"
          items={adItemsNest}
          expandIcon={({ isActive }) => (
            <BiCaretRight style={{ rotate: `${isActive ? 90 : 0}deg` }} />
          )}
        />
        {hasNextPage && (
          <LoadMoreButton
            doInfiniteScroll={false}
            handleLoadMore={() => {
              if (!isFetching && !isFetchingNextPage) fetchNextPage();
            }}
          />
        )}
      </div>
    </>
  );
};
