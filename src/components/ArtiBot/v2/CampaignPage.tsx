import { useGetCampaignInsights } from "@/api/conversation";
import { useEffect, useMemo, useState } from "react";
import {
  DeployAdChildCard,
  InsightTitle,
} from "../MessageItems/DeployAdInsightsCard";
import { Spinner } from "@nextui-org/react";
import { BiCaretRight } from "react-icons/bi";
import { Collapse, CollapseProps } from "antd";
import { useGetAdSets } from "@/api/user";

interface DeployAdChildCardProps {
  campaignId: string;
  accountId: string;
}
const CampaignChildCard = ({
  accountId,
  campaignId,
}: DeployAdChildCardProps) => {
  //   const { state } = useConversation();
  // //   const adsData = state.ad.findAllBy("adsetId", adsetId ?? "");
  //   const { data: ads, isLoading } = useGetAds({
  //     adIds: adsData.map((ad) => ad.adId),
  //     enabled: adsData.length > 0 && isActive,
  //     accountId: adsData[0]?.adAccountId ?? undefined,
  //   });

  const {
    data: adsets,
    isLoading,
    isFetching,
  } = useGetAdSets({
    campaignIds: [campaignId],
    providedAccountId: accountId,
  });

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
            <InsightTitle
              isFetching={isFetching}
              name={adset.name}
              insights={adset.insights?.data[0]}
            />
          ),
          children: (
            <DeployAdChildCard
              adsetId={adset.id}
              accountId={accountId}
              isActive={activeKeys.includes(adset.id)}
            />
          ),
        };
      }) ?? []
    );
  }, [accountId, activeKeys, adsets, isFetching]);

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
  const { data, isFetching, ...props } = useGetCampaignInsights(campaignId);

  const [activeKeys, setActiveKeys] = useState<string[]>(["1"]);
  const onChange = (key: string | string[]) => {
    console.log(key);
    setActiveKeys(typeof key === "string" ? [key] : key);
  };

  // [
  //   {
  //     key: "1",
  //     label: <AdTitle />,
  //     children: <InsightCard show={true} className="mt-2" />,
  //   },
  // ];

  const adsetItems = useMemo(() => {
    if (!data) return [];
    return [
      {
        key: "1",
        label: (
          <InsightTitle
            isFetching={isFetching}
            name={data.name}
            insights={data.insights?.data[0]}
          />
        ),
        children: (
          <CampaignChildCard
            accountId={data.ad_account_id}
            campaignId={data.id}
          />
        ),
      },
    ];
  }, [data, isFetching]);

  return (
    <>
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
            items={adsetItems}
            expandIcon={({ isActive }) => (
              <BiCaretRight style={{ rotate: `${isActive ? 90 : 0}deg` }} />
            )}
          />
        </div>
      )}
    </>
  );
}
