import {
  Accordion,
  AccordionItem,
  Avatar,
  Divider,
  Spinner,
} from "@nextui-org/react";
import { Collapse, CollapseProps } from "antd";
import { AnimatePresence } from "framer-motion";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BiCaretDown, BiCaretRight, BiCaretUp } from "react-icons/bi";
import { motion } from "framer-motion";
import { omit } from "lodash";
import {
  IAd,
  IAdSet,
  IFacebookAdInsight,
  PaginatedResponse,
} from "@/interfaces/ISocial";
import { prefixAccountId, useGetAds, useGetCampaigns } from "@/api/user";
import { botData } from "@/constants/images";
import { MdDownload, MdEdit, MdRemoveRedEye } from "react-icons/md";
import writeXlsxFile from "write-excel-file";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import useCampaignStore, { CampaignTab } from "@/store/campaign";
import { LoadMoreButton } from "../LeftPane/LeftPane";
import { PreviewProps } from "./Deploy/Ad/components/Ads/Create/CreateAd";
import { useTimeRange } from "@/context/TimeRangeContext";
import { AdLeadData, useGetVariant } from "@/api/conversation";
import { SnackbarContext } from "@/context/SnackbarContext";
import { useFetchLeadsData, useGetAdIdentifiers } from "@/api/admanager";
import { TbEyeShare } from "react-icons/tb";
import Link from "next/link";
import { RiExternalLinkFill } from "react-icons/ri";
import { useRouter } from "next/navigation";

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

async function handleDownload(
  name: string,
  ads?: PaginatedResponse<AdLeadData>
) {
  if (!ads) {
    throw new Error("No data to download");
  }

  const excelData = ads.data.reduce((acc, ad) => {
    if (!ad.leads || ad.leads?.data?.length === 0) return acc;
    const headerData = ad.leads.data[0].field_data.map((field) => ({
      value: formatInsightName(field.name),
      fontWeight: "bold",
    }));
    const data = ad.leads.data.reduce((acc, lead) => {
      const leadData = headerData.map((header) => {
        const field = lead.field_data.find(
          (field) => formatInsightName(field.name) === header.value
        );
        return {
          type: String,
          value: field ? field.values.join(", ") : "",
        };
      });
      acc.push(leadData);
      return acc;
    }, [] as any);
    const obj = {
      sheet: ad.name,
      data: [headerData, ...data],
      columns: headerData.map((c) => ({ width: 40 })),
    };
    acc.push(obj);
    return acc;
  }, [] as any);

  // const HEADER_ROW = [
  //   {
  //     value: "Insight Key",
  //     fontWeight: "bold",
  //   },
  //   {
  //     value: "Insight Value",
  //     fontWeight: "bold",
  //   },
  // ];

  // const HEADER_ROW_2 = [
  //   {
  //     value: "Insight Key",
  //     fontWeight: "bold",
  //   },
  //   {
  //     value: "Insight Value",
  //     fontWeight: "bold",
  //   },
  // ];

  // const globalKeyObject: Omit<
  //   IFacebookAdInsight,
  //   "date_start" | "date_stop" | "actions" | "conversions"
  // > = omit(insights, ["date_start", "date_stop", "actions", "conversions"]);

  // const globals = Object.keys(globalKeyObject).map((key) => [
  //   {
  //     type: String,
  //     value: formatInsightName(key),
  //   },
  //   {
  //     type: String,
  //     value: formatInsightValue(
  //       globalKeyObject[key as keyof typeof globalKeyObject]
  //     ),
  //   },
  // ]);

  // const actions =
  //   insights?.actions.map((action) => [
  //     {
  //       type: String,
  //       value: formatInsightName(action.action_type),
  //     },
  //     {
  //       type: String,
  //       value: formatInsightValue(action.value),
  //     },
  //   ]) ?? [];

  // const data = [HEADER_ROW, ...globals];

  // const data2 = [HEADER_ROW_2, ...actions];

  console.log("excelData - ", excelData);

  if (excelData.length === 0) {
    throw new Error("No data to download");
  }

  await writeXlsxFile(
    excelData.map((c: any) => c.data),
    {
      columns: excelData.map((c: any) => c.columns),
      fileName: name + ".xlsx",
      fontSize: 14,
      sheets: excelData.map((c: any) => c.sheet.slice(0, 30)),
    }
  );
}

export function InsightTitle<
  T extends { id: string; ads?: PaginatedResponse<AdLeadData> },
>({
  name,
  data,
  insights,
  isFetching,
  label = "adset",
  tab,
  ad_account_id,
  type = "campaigns",
}: {
  name: string;
  data?: T;
  insights?: IFacebookAdInsight;
  isFetching?: boolean;
  label?: "adset" | "campaign" | "ad";
  tab?: CampaignTab;
  ad_account_id?: string;
  type: "adsets" | "campaigns";
}) {
  const [show, setShow] = useState(false);
  const { setSelectAdAccount, setFormState } = useCampaignStore();
  const [, setSnackbarData] = useContext(SnackbarContext).snackBarData;

  const { mutate: fetchLeadsData, isPending: isLeadsDataFetching } =
    useFetchLeadsData<typeof type>({
      onSuccess: async (data, variables, context) => {
        try {
          await handleDownload(name, data);
        } catch (e: any) {
          setSnackbarData({
            message: e.message ?? "Failed to download data",
            status: "error",
          });
        }
      },
    });

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
            {data?.id &&
              (isLeadsDataFetching ? (
                <Spinner size="sm" />
              ) : (
                <MdDownload
                  className="text-xl"
                  onClick={async (e: any) => {
                    e.stopPropagation();
                    fetchLeadsData({
                      type,
                      id: data?.id,
                    });
                  }}
                />
              ))}
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

function AdPreviewWithAdId({
  ad_id,
  handlePreview,
  previewLink,
}: {
  ad_id?: string;
  handlePreview?: (props: PreviewProps) => void;
  previewLink?: string;
}) {
  const { data, isFetching } = useGetVariant({ ad_id });
  return isFetching ? (
    <Spinner size="sm" />
  ) : (
    data?.imageUrl && (
      <MdRemoveRedEye
        className="text-xl cursor-pointer"
        onClick={async (e: any) => {
          e.stopPropagation();
          const previewProps: PreviewProps = {
            image: data?.imageUrl,
            text: data?.text,
            previewLink: previewLink,
          };
          handlePreview && handlePreview(previewProps);
        }}
      />
    )
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
  const router = useRouter();
  const { setFormState, setSelectAdAccount } = useCampaignStore();
  const [, setSnackbarData] = useContext(SnackbarContext).snackBarData;

  const { data: adIdentifierMap, isFetching: isAdIdentifierFetching } =
    useGetAdIdentifiers({ ad_id: ad.id });

  const { mutate: fetchLeadsData, isPending: isLeadsDataFetching } =
    useFetchLeadsData<"ad_entities">({
      onSuccess: async (data, variables, context) => {
        try {
          await handleDownload(ad.name, {
            data: [
              {
                id: ad.id,
                name: ad.name,
                leads: data,
              },
            ],
            paging: {
              cursors: {
                before: "",
                after: "",
              },
            },
          });
        } catch (e: any) {
          setSnackbarData({
            message: e.message ?? "Failed to download data",
            status: "error",
          });
        }
      },
    });

  return (
    <div
      className="flex justify-between items-start fioverflow-hidden"
      data-adid={ad.id}
    >
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
          src={
            ad.creative.thumbnail_url ??
            ad.creative.image_url ??
            botData.image.src
          }
        />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">{ad.name}</span>
          {/* <span className="text-xs opacity-60 line-clamp-2">
            {ad.creative.object_story_spec?.link_data?.message ?? (
              <span className="opacity-40"></span>
            )}
          </span> */}
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
        {handlePreview && ad.creative.image_url ? (
          <MdRemoveRedEye
            className="text-xl"
            onClick={() => {
              if (!ad.creative.image_url) return;
              const previewProps: PreviewProps = {
                image: ad.creative.image_url,
                text: ad.creative.object_story_spec?.link_data?.message ?? "",
                previewLink: ad.preview_shareable_link,
              };
              handlePreview && handlePreview(previewProps);
            }}
          />
        ) : (
          <AdPreviewWithAdId ad_id={ad.id} handlePreview={handlePreview} />
        )}
        {isAdIdentifierFetching ? (
          <Spinner size="sm" />
        ) : (
          <RiExternalLinkFill
            className="text-xl cursor-pointer"
            onClick={() => {
              if (!adIdentifierMap) return;
              router.push(
                `/artibot/ad_creative?conversation_id=${adIdentifierMap.conversationId}&message_id=${adIdentifierMap.messageId}`
              );
            }}
          />
        )}
        {ad.id &&
          (isLeadsDataFetching ? (
            <Spinner size="sm" />
          ) : (
            <MdDownload
              className="text-xl"
              onClick={async (e: any) => {
                e.stopPropagation();
                fetchLeadsData({
                  type: "ad_entities",
                  id: ad?.id,
                });
              }}
            />
          ))}
      </div>
    </div>
  );
}

// export const

interface DeployAdChildCardProps {
  isActive: boolean;
  adsetId: string;
  accountId?: string;
  handlePreview?: (props: PreviewProps) => void;
}
export const DeployAdChildCard = ({
  isActive,
  adsetId,
  accountId,
  handlePreview,
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
  }, [ads, handlePreview, accountId]);

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
              accountId={prefixAccountId(props.adset?.account_id)}
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
