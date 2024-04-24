import { useFetchLeadsData } from "@/api/admanager";
import { AdLeadData } from "@/api/conversation";
import { SnackbarContext } from "@/context/SnackbarContext";
import { IFacebookAdInsight, PaginatedResponse } from "@/interfaces/ISocial";
import useCampaignStore, { CampaignTab } from "@/store/campaign";
import { useContext, useState } from "react";
import { handleDownload } from "./DeployAdInsightsCard";
import { Spinner } from "@nextui-org/react";
import { MdDownload, MdEdit } from "react-icons/md";
import InsightCard from "./InsightCard";

export default function InsightTitle<
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
