import { useGetCampaignInsights } from "@/api/conversation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DeployAdChildCard,
  InsightTitle,
} from "../MessageItems/DeployAdInsightsCard";
import { Spinner } from "@nextui-org/react";
import { BiCaretRight } from "react-icons/bi";
import { Collapse, CollapseProps } from "antd";
import { useGetAdSets } from "@/api/user";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import DateRangePicker from "@/components/shared/renderers/DateRangePicker";
import { RangeValueType } from "rc-picker/lib/PickerInput/RangePicker";
import dayjs, { Dayjs } from "dayjs";
import { CampaignTab } from "@/store/campaign";
import { LoadMoreButton } from "../LeftPane/LeftPane";
import CreateAdManagerModal from "../MessageItems/Deploy/Ad/CreateAdManagerModal";
import AdPreviewModal from "./AdPreviewModal";
import { PreviewProps } from "../MessageItems/Deploy/Ad/components/Ads/Create/CreateAd";
import { useTimeRange } from "@/context/TimeRangeContext";
import { defaultTimeRange } from "../LeftPane/CampaignListItem";

interface DeployAdChildCardProps {
  campaignId: string;
  accountId: string;
  handlePreview?: (props: PreviewProps) => void;
}
const CampaignChildCard = ({
  accountId,
  campaignId,
  handlePreview,
}: DeployAdChildCardProps) => {
  const { timeRange } = useTimeRange();
  const {
    data: adsetPages,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetAdSets({
    campaignIds: [campaignId],
    providedAccountId: accountId,
    timeRange,
    get_leads: true,
  });

  const adsets = useMemo(() => {
    return adsetPages?.pages.map((page) => page.data).flat();
  }, [adsetPages]);

  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const onChange = (key: string | string[]) => {
    console.log(key);
    setActiveKeys(typeof key === "string" ? [key] : key);
  };

  useEffect(() => {
    if (adsets) {
      setActiveKeys([adsets[0]?.id]);
    }
  }, [adsets]);

  const adItemsNest: CollapseProps["items"] = useMemo(() => {
    return (
      adsets?.map((adset) => {
        return {
          key: adset.id,
          label: (
            <ErrorBoundary errorComponent={ErrorComponent}>
              <InsightTitle
                isFetching={isFetching}
                name={adset.name}
                insights={adset.insights?.data[0]}
                data={adset}
                tab={CampaignTab.ADSETS}
                ad_account_id={accountId}
                type="adsets"
              />
            </ErrorBoundary>
          ),
          children: (
            <ErrorBoundary errorComponent={ErrorComponent}>
              <DeployAdChildCard
                adsetId={adset.id}
                accountId={accountId}
                isActive={activeKeys.includes(adset.id)}
                handlePreview={handlePreview}
              />
            </ErrorBoundary>
          ),
        };
      }) ?? []
    );
  }, [accountId, activeKeys, adsets, isFetching, handlePreview]);

  return (
    <>
      {isLoading && (
        <div className="w-full flex gap-2 items-center justify-center text-xs">
          <Spinner label="Loading Ad Sets" />
        </div>
      )}
      {!isLoading &&
        (adsets ? (
          <div className="flex flex-col gap-4">
            <Collapse
              onChange={onChange}
              defaultActiveKey={adsets && adsets[0]?.id}
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
        ) : (
          <div className="flex items-center justify-center">
            <p className="text-xs opacity-40">
              No adsets available for this campaign.
            </p>
          </div>
        ))}
    </>
  );
};

export default function CampaignPage({ campaignId }: { campaignId: string }) {
  const { timeRange, setTimeRange } = useTimeRange();

  useEffect(() => {
    setTimeRange(defaultTimeRange);
  }, [setTimeRange]);

  const { data, isFetching, ...props } = useGetCampaignInsights({
    campaignId,
    timeRange: timeRange,
    get_leads: true,
  });

  const [activeKeys, setActiveKeys] = useState<string[]>(["1"]);
  const onChange = (key: string | string[]) => {
    setActiveKeys(typeof key === "string" ? [key] : key);
  };

  const [open, setOpen] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewProps | null>(null);

  const handlePreview = useCallback((previeProps: PreviewProps) => {
    setPreviewData(previeProps);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const campaignItems = useMemo(() => {
    if (!data) return [];
    return [
      {
        key: "1",
        label: (
          <ErrorBoundary errorComponent={ErrorComponent}>
            <InsightTitle
              isFetching={isFetching}
              name={data.name}
              data={data}
              insights={data.insights?.data[0]}
              tab={CampaignTab.CAMPAIGNS}
              ad_account_id={data.ad_account_id}
              type="campaigns"
            />
          </ErrorBoundary>
        ),
        children: (
          <ErrorBoundary errorComponent={ErrorComponent}>
            <CampaignChildCard
              accountId={data.ad_account_id}
              campaignId={data.id}
              handlePreview={handlePreview}
            />
          </ErrorBoundary>
        ),
      },
    ];
  }, [data, isFetching, handlePreview]);

  function handleDateRangeChange(range: RangeValueType<Dayjs>) {
    console.log("range - ", range);
    setTimeRange(range);
  }

  return (
    <>
      <div className="w-full flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold text-white">Campaign Insights</h1>
        </div>
        <div className="max-w-[300px]">
          <DateRangePicker value={timeRange} onChange={handleDateRangeChange} />
        </div>
      </div>
      {props.isLoading && (
        <div className="w-full flex gap-2 items-center justify-center text-xs">
          <Spinner label="Fetching Campaign Insights" />
        </div>
      )}
      {data && (
        <div className="w-full">
          <Collapse
            className="w-full bg-gray-800"
            onChange={onChange}
            defaultActiveKey={activeKeys}
            items={campaignItems}
            expandIcon={({ isActive }) => (
              <BiCaretRight style={{ rotate: `${isActive ? 90 : 0}deg` }} />
            )}
          />
        </div>
      )}
      <CreateAdManagerModal />
      <AdPreviewModal
        open={open}
        handleClose={handleClose}
        previewData={previewData}
      />
    </>
  );
}
