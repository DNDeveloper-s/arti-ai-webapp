import { IFacebookAdInsight } from "@/interfaces/ISocial";
import { AnimatePresence } from "framer-motion";
import { merge, omit } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { formatInsightName, formatInsightValue } from "./DeployAdInsightsCard";
import { BiCaretDown, BiCaretUp } from "react-icons/bi";
import { Divider } from "@nextui-org/react";

export default function InsightCard(
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

  const globalKeyObject = useMemo(() => {
    const omittedGlobals = omit(insights, [
      "date_start",
      "date_stop",
      "actions",
      "conversions",
      "campaign_id",
      "adset_id",
      "ad_id",
      "account_currency",
    ]);

    return merge(omittedGlobals, {
      impressions: insights.impressions,
      leads:
        insights.actions?.find((a) => a.action_type === "lead")?.value || 0,
      reach: insights.reach,
      spent: insights.spend,
    });
  }, [insights]);

  // export function extractFromInsights(insight?: IFacebookAdInsight) {
  //   if (!insight) return null;
  //   return {
  //     impressions: insight.impressions,
  //     leads: insight.actions?.find((a) => a.action_type === "lead")?.value || 0,
  //     reach: insight.reach,
  //     spent: insight.spend,
  //   };
  // }

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
              {Object.keys(globalKeyObject).map((key: any, index) => (
                <div key={index} className="flex gap-2 text-tiny items-end">
                  <span className="opacity-50 flex-1">
                    {formatInsightName(key)}:{" "}
                  </span>
                  {/* @ts-ignore */}
                  <span>{formatInsightValue(globalKeyObject[key])}</span>
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
