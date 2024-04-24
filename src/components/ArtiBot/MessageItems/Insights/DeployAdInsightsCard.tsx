import { Spinner } from "@nextui-org/react";
import { Collapse } from "antd";
import { useMemo, useState } from "react";
import { BiCaretRight } from "react-icons/bi";
import { IAdSet, PaginatedResponse } from "@/interfaces/ISocial";
import { prefixAccountId } from "@/api/user";

import writeXlsxFile from "write-excel-file";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import { CampaignTab } from "@/store/campaign";
import { AdLeadData } from "@/api/conversation";
import InsightTitle from "./InsightTitle";
import { DeployAdChildCard } from "./DeployAdChildCard";

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

export async function handleDownload(
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
              type="adsets"
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
