import {
  Accordion,
  AccordionItem,
  Avatar,
  Divider,
  Spinner,
} from "@nextui-org/react";
import { Collapse, CollapseProps } from "antd";
import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BiCaretDown, BiCaretRight, BiCaretUp } from "react-icons/bi";
import { motion } from "framer-motion";
import { omit } from "lodash";
import { IAd, IAdSet, IFacebookAdInsight } from "@/interfaces/ISocial";
import { useGetAds, useGetCampaigns } from "@/api/user";
import { botData } from "@/constants/images";
import { MdDownload, MdEdit, MdRemoveRedEye } from "react-icons/md";
import writeXlsxFile from "write-excel-file";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import useCampaignStore, { CampaignTab } from "@/store/campaign";
import { LoadMoreButton } from "../LeftPane/LeftPane";
import { PreviewProps } from "./Deploy/Ad/components/Ads/Create/CreateAd";

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

// const itemsNest: CollapseProps["items"] = [
//   {
//     key: "1",
//     label: <AdTitle />,
//     children: <InsightCard show={true} className="mt-2" />,
//   },
// ];

const insights = {
  impressions: "2825",
  reach: "1697",
  spend: "194.74",
  unique_clicks: "167",
  ctr: "7.504425",
  actions: [
    {
      action_type: "post",
      value: "2",
    },
    {
      action_type: "landing_page_view",
      value: "130",
    },
    {
      action_type: "onsite_conversion.post_save",
      value: "1",
    },
    {
      action_type: "comment",
      value: "1",
    },
    {
      action_type: "page_engagement",
      value: "211",
    },
    {
      action_type: "post_engagement",
      value: "211",
    },
    {
      action_type: "video_view",
      value: "5",
    },
    {
      action_type: "post_reaction",
      value: "1",
    },
    {
      action_type: "offsite_conversion.fb_pixel_custom",
      value: "15",
    },
    {
      action_type: "link_click",
      value: "201",
    },
  ],
  cpm: "68.934513",
  date_start: "2024-02-21",
  date_stop: "2024-03-21",
};

export function formatInsightName(name: string) {
  let _name: any = name;
  // Remove the word after "."
  _name = _name.split(".")[0];

  if (!_name) return "Unknown Insight";

  // Split the string by _
  _name = _name.split("_");

  // If name has ctr or cpm in it, make it uppercase
  if (_name.includes("ctr") || _name.includes("cpm")) {
    _name = _name.map((word: string) => word.toUpperCase());
  }

  // Make the first letter of each word uppercase
  _name = _name.map(
    (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
  );

  // Join the words with a space
  return _name.join(" ");
}

export function formatInsightValue(value?: string | number | null): string {
  if (!value) return "";

  // Check if the parsed value is a valid number
  if (!isNaN(+value)) {
    // Convert value to a number if it's a string
    const numberValue = parseFloat(value.toString());
    // If it's a floating-point number, fix it to 2 decimal places
    if (Number.isFinite(numberValue) && !Number.isInteger(numberValue)) {
      return numberValue.toFixed(2);
    } else {
      // If it's an integer, return it as is
      return numberValue.toString();
    }
  } else {
    // If the value cannot be parsed as a number, return it as is
    return value.toString();
  }
}

function InsightCard(
  props: {
    show: boolean;
    insights: IFacebookAdInsight;
  } & React.HTMLProps<HTMLDivElement>
) {
  const { className, show, insights, ..._props } = props;
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    !show && setShowMore(false);
  }, [show]);

  const globalKeyObject = omit(insights, [
    "date_start",
    "date_stop",
    "actions",
    "conversions",
  ]);

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div {..._props}>
            <div
              className={
                "grid grid-cols-2 gap-x-8 gap-y-2 " + (className ?? "")
              }
              {..._props}
            >
              {Object.keys(globalKeyObject).map((key, index) => (
                <div key={index} className="flex gap-2 text-tiny items-end">
                  <span className="opacity-50 flex-1">
                    {formatInsightName(key)}:{" "}
                  </span>
                  <span>
                    {formatInsightValue(
                      globalKeyObject[key as keyof typeof globalKeyObject]
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-1" items-center>
              <div className="flex-1"></div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMore((c) => !c);
                }}
                className="text-xs flex items-center gap-1 cursor-pointer hover:underline text-blue-500"
              >
                <span>View {showMore ? "Less" : "More"}</span>
                {showMore ? <BiCaretUp /> : <BiCaretDown />}
              </div>
            </div>
            <AnimatePresence mode="wait">
              {showMore && (
                <>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <Divider className="my-3 !w-auto flex-1 items-center" />
                    <div className={"grid grid-cols-2 gap-x-8 gap-y-2"}>
                      {insights.actions.map((action, index) => (
                        <div
                          key={index}
                          className="flex gap-2 text-tiny items-end"
                        >
                          <span className="opacity-50 flex-1">
                            {formatInsightName(action.action_type)}:{" "}
                          </span>
                          <span>{formatInsightValue(action.value)}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

async function handleDownload(name: string, insights?: IFacebookAdInsight) {
  if (!insights) return;

  const HEADER_ROW = [
    {
      value: "Insight Key",
      fontWeight: "bold",
    },
    {
      value: "Insight Value",
      fontWeight: "bold",
    },
  ];

  const globalKeyObject: Omit<
    IFacebookAdInsight,
    "date_start" | "date_stop" | "actions" | "conversions"
  > = omit(insights, ["date_start", "date_stop", "actions", "conversions"]);

  const globals = Object.keys(globalKeyObject).map((key) => [
    {
      type: String,
      value: formatInsightName(key),
    },
    {
      type: String,
      value: formatInsightValue(
        globalKeyObject[key as keyof typeof globalKeyObject]
      ),
    },
  ]);

  const actions =
    insights?.actions.map((action) => [
      {
        type: String,
        value: formatInsightName(action.action_type),
      },
      {
        type: String,
        value: formatInsightValue(action.value),
      },
    ]) ?? [];

  const data = [HEADER_ROW, ...globals, ...actions];

  await writeXlsxFile(data, {
    columns: [{ width: 40 }, { width: 30 }],
    fileName: name + ".xlsx",
    fontSize: 14,
    sheet: name.slice(0, 20),
  });
}

export function InsightTitle<T extends { id: string }>({
  name,
  data,
  insights,
  isFetching,
  label = "adset",
  tab,
  ad_account_id,
}: {
  name: string;
  data?: T;
  insights?: IFacebookAdInsight;
  isFetching?: boolean;
  label?: "adset" | "campaign" | "ad";
  tab?: CampaignTab;
  ad_account_id?: string;
}) {
  const [show, setShow] = useState(false);
  const { setSelectAdAccount, setFormState } = useCampaignStore();

  return (
    <div className="overflow-hidden">
      <div className="flex items-center justify-between">
        <p>{name}</p>
        {/* <button
          onClick={(e) => {
            e.stopPropagation();
            setShow((c) => !c);
          }}
          className="text-xs cursor-pointer hover:underline flex items-center gap-1 text-blue-500"
        >
          <span>View Insight Details</span>
          <BiCaretDown />
        </button> */}
        <div className="flex items-center gap-4">
          {isFetching && <Spinner size="sm" />}
          <div className="flex items-center gap-2">
            {ad_account_id && data && tab && (
              <MdEdit
                className="text-xl"
                onClick={(e: any) => {
                  e.stopPropagation();
                  setSelectAdAccount(ad_account_id);
                  setFormState({
                    open: true,
                    mode: "edit",
                    rawData: data,
                    tab,
                  });
                }}
              />
            )}
            <MdDownload
              className="text-xl"
              onClick={(e: any) => {
                e.stopPropagation();
                handleDownload(name, insights);
              }}
            />
          </div>
        </div>
      </div>
      {insights ? (
        <InsightCard insights={insights} show={true} className="mt-2" />
      ) : (
        <div className="flex items-center justify-center">
          <p className="text-xs opacity-40">
            No insights available for this {label}.
          </p>
        </div>
      )}
    </div>
  );
}

function AdTitle({
  ad,
  ad_account_id,
  handlePreview,
}: {
  ad: IAd;
  ad_account_id?: string;
  handlePreview?: (props: PreviewProps) => void;
}) {
  const { setFormState, setSelectAdAccount } = useCampaignStore();
  return (
    <div className="flex justify-between items-start fioverflow-hidden">
      <div className="flex gap-4 items-center ">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {/* <img
        alt="Image"
        src="https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?cs=srgb&dl=pexels-guillaume-meurice-1591447.jpg&fm=jpg"
      /> */}
        <Avatar
          isBordered
          color="default"
          radius="sm"
          classNames={{
            base: "flex-shrink-0",
          }}
          src={ad.creative.image_url ?? botData.image.src}
        />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">{ad.name}</span>
          <span className="text-xs opacity-60 line-clamp-2">
            {ad.creative.object_story_spec?.link_data?.message ?? (
              <span className="opacity-40">No text provided for this ad.</span>
            )}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {ad_account_id && ad && (
          <MdEdit
            className="text-xl"
            onClick={(e: any) => {
              e.stopPropagation();
              setSelectAdAccount(ad_account_id);
              setFormState({
                open: true,
                mode: "edit",
                rawData: ad,
                tab: CampaignTab.ADS,
              });
            }}
          />
        )}
        {handlePreview && ad.creative.image_url && (
          <MdRemoveRedEye
            className="text-xl"
            onClick={() => {
              if (!ad.creative.image_url) return;
              const previewProps: PreviewProps = {
                image: ad.creative.image_url,
                text:
                  ad.creative.object_story_spec?.link_data?.message ??
                  "No text provided",
                previewLink: ad.preview_shareable_link,
              };
              handlePreview && handlePreview(previewProps);
            }}
          />
        )}
        <MdDownload
          className="text-xl"
          onClick={(e: any) => {
            e.stopPropagation();
            handleDownload(ad.name, ad.insights?.data[0]);
          }}
        />
      </div>
    </div>
  );
}

// export const

interface DeployAdChildCardProps {
  isActive: boolean;
  adsetId: string;
  accountId: string;
  handlePreview?: (props: PreviewProps) => void;
}
export const DeployAdChildCard = ({
  isActive,
  adsetId,
  accountId,
  handlePreview,
}: DeployAdChildCardProps) => {
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
          label: (
            <AdTitle
              handlePreview={handlePreview}
              ad={ad}
              ad_account_id={accountId}
            />
          ),
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

interface DeployAdInsightsCardProps {
  adset?: IAdSet;
  isFetching?: boolean;
}
export const DeployAdInsightsCard = (props: DeployAdInsightsCardProps) => {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
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
    if (!props.adset) return [];
    return [
      {
        key: "1",
        label: (
          <ErrorBoundary errorComponent={ErrorComponent}>
            <InsightTitle
              name={props.adset.name}
              insights={props.adset.insights?.data[0]}
              data={props.adset}
              tab={CampaignTab.ADSETS}
              label="campaign"
            />
          </ErrorBoundary>
        ),
        children: props.adset?.id && (
          <ErrorBoundary errorComponent={ErrorComponent}>
            <DeployAdChildCard
              isActive={activeKeys.includes("1")}
              adsetId={props.adset?.id}
            />
          </ErrorBoundary>
        ),
      },
    ];
  }, [activeKeys, props.adset]);

  return (
    <>
      {props.isFetching && (
        <div className="w-full flex gap-2 items-center justify-center text-xs">
          <Spinner label="Fetching Ad Insights" />
        </div>
      )}
      {props.adset && (
        <div className="w-full">
          <Collapse
            className="w-full bg-gray-800"
            onChange={onChange}
            items={adsetItems}
            expandIcon={({ isActive }) => (
              <BiCaretRight style={{ rotate: `${isActive ? 90 : 0}deg` }} />
            )}
          />
        </div>
      )}
    </>
  );
};
