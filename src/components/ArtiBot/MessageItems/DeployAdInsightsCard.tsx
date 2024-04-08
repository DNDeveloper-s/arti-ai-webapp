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
import { useGetAds } from "@/api/user";
import { useConversation } from "@/context/ConversationContext";
import { NoImage } from "../LeftPane/ConversationListItem";
import { botData } from "@/constants/images";
import { popGraphicsState } from "pdf-lib";

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

function formatInsightName(name: string) {
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

function formatInsightValue(value?: string | number | null): string {
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
export function InsightTitle({
  name,
  insights,
  isFetching,
}: {
  name: string;
  insights?: IFacebookAdInsight;
  isFetching?: boolean;
}) {
  const [show, setShow] = useState(false);
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
        {isFetching && <Spinner size="sm" />}
      </div>
      {insights ? (
        <InsightCard insights={insights} show={true} className="mt-2" />
      ) : (
        <div className="flex items-center justify-center">
          <p className="text-xs opacity-40">
            No insights available for this adset.
          </p>
        </div>
      )}
    </div>
  );
}

function AdTitle({ ad }: { ad: IAd }) {
  return (
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
  );
}

// export const

interface DeployAdChildCardProps {
  isActive: boolean;
  adsetId: string;
  accountId: string;
}
export const DeployAdChildCard = ({
  isActive,
  adsetId,
  accountId,
}: DeployAdChildCardProps) => {
  const { data: ads, isLoading } = useGetAds({
    adsetIds: [adsetId],
    enabled: isActive,
    accountId: accountId,
  });

  const adItemsNest: CollapseProps["items"] = useMemo(() => {
    return (
      ads?.map((ad) => {
        return {
          key: ad.id,
          label: <AdTitle ad={ad} />,
          children: (
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
          ),
        };
      }) ?? []
    );
  }, [ads]);

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
          <InsightTitle
            name={props.adset.name}
            insights={props.adset.insights?.data[0]}
          />
        ),
        children: props.adset?.id && (
          <DeployAdChildCard
            isActive={activeKeys.includes("1")}
            adsetId={props.adset?.id}
          />
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
