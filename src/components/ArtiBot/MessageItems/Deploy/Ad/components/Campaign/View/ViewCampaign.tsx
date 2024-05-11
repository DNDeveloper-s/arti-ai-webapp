import {
  Key,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import api from "../../../api/arti_api";
import Loader from "@/components/Loader";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Switch,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownItem,
  DropdownMenu,
  Link,
} from "@nextui-org/react";
import { RxExit } from "react-icons/rx";
import SwitchComponent from "../../SwitchComponent";
import UiTable from "@/components/shared/renderers/UiTable";
import { FaEllipsisVertical } from "react-icons/fa6";
import useCampaignStore, { CampaignTab } from "@/store/campaign";
import { Platform, useUser } from "@/context/UserContext";
import {
  useCredentials,
  useGetAdAccountId,
  useGetCampaigns,
  useUpdateCampaign,
} from "@/api/user";
import { access } from "fs";
import { SnackbarContext } from "@/context/SnackbarContext";
import { ADMANAGER_STATUS_TYPE, IAdCampaign } from "@/interfaces/ISocial";
import { useQueryClient } from "@tanstack/react-query";
import API_QUERIES from "@/config/api-queries";
import SwitchStatus from "../../SwitchStatus";
import { ICampaignInfinite, useGetInifiniteCampaigns } from "@/api/admanager";
import { wait } from "@/helpers";

const delay = (delay: number) =>
  new Promise((res) => {
    setTimeout(res, delay);
  });

const columns = [
  { name: "OFF/ON", uid: "status" },
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "OBJECTIVE", uid: "objective" },
  { name: "ACTIONS", uid: "actions" },
];

interface Campaign {
  id: string;
  name: string;
  objective: string;
  status: string;
}

export default function ViewCampaign(
  {
    //   onCampaignSelection,
  }: {
    accessToken?: string;
    onCampaignSelection?: any;
  }
) {
  const queryClient = useQueryClient();
  const {
    data: campaignPagesData,
    isFetching,
    isLoading,
    fetchStatus,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetInifiniteCampaigns();
  const campaigns = campaignPagesData?.pages.map((page) => page.data).flat();

  const fetchNextPageFn = useCallback(() => {
    if (!isFetching && !isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, isFetching, isFetchingNextPage]);

  const [snackBarData, setSnackBarData] =
    useContext(SnackbarContext).snackBarData;

  const { mutate: postUpdateCampaign, isPending: isUpdating } =
    useUpdateCampaign();

  const {
    setShowProgress,
    setFormState,
    selected,
    setSelected,
    viewAdsetsByCampaign,
  } = useCampaignStore();

  useEffect(() => {
    setShowProgress(isUpdating);
  }, [isUpdating, setShowProgress]);

  const { accessToken, accountId } = useCredentials();

  const handleToggle = useCallback(
    (id: string, status: ADMANAGER_STATUS_TYPE) => {
      postUpdateCampaign({
        campaign: { status },
        campaignId: id,
        successMessage: "Campaign is now " + status + "",
        errorMessage: "Failed to update campaign status!",
      });
    },
    [postUpdateCampaign]
  );

  function handleAddClick() {
    setFormState({ tab: CampaignTab.CAMPAIGNS, open: true, mode: "create" });
  }

  function editCampaign(campaignId: string) {
    try {
      const currentCampaign = campaigns?.find(
        (campaign: ICampaignInfinite) => campaign.id === campaignId
      );

      if (!currentCampaign) {
        throw new Error("Please select a single campaign to edit");
      }

      setFormState({
        tab: CampaignTab.CAMPAIGNS,
        open: true,
        mode: "edit",
        rawData: currentCampaign,
      });
    } catch (e: any) {
      setSnackBarData({
        status: "error",
        message: e.message,
      });
    }
  }

  function handleEditClick() {
    try {
      const currentCampaignId =
        selected.campaigns instanceof Set &&
        (selected.campaigns.values().next().value as string);

      if (!currentCampaignId) {
        throw new Error("Please select a single campaign to edit");
      }

      editCampaign(currentCampaignId);
    } catch (e: any) {
      setSnackBarData({
        status: "error",
        message: e.message,
      });
    }
  }

  const renderCell = useCallback(
    (campaign: IAdCampaign, columnKey: Key) => {
      const cellValue = campaign[columnKey as keyof IAdCampaign];

      switch (columnKey) {
        case "id":
          return (
            <div className="h-full w-full">
              <Link
                color="primary"
                href="#"
                onClick={(e: any) => {
                  e.preventDefault();
                  viewAdsetsByCampaign(cellValue);
                }}
                showAnchorIcon
                className="text-small h-full leading-[3] hover:underline"
              >
                {campaign.id}
              </Link>
            </div>
          );
        case "name":
          return <div className="flex items-center gap-3">{campaign.name}</div>;
        case "objective":
          return (
            <div className="flex flex-col">
              {/* <p className="text-bold text-small capitalize">{cellValue}</p> */}
              <p className="text-bold text-tiny capitalize text-default-500">
                {campaign.objective}
              </p>
            </div>
          );
        case "status":
          return (
            <SwitchStatus
              onToggle={(status: ADMANAGER_STATUS_TYPE) =>
                handleToggle(campaign.id, status)
              }
              value={cellValue}
            />
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <FaEllipsisVertical className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      queryClient.invalidateQueries({
                        queryKey: API_QUERIES.GET_CAMPAIGNS(
                          accessToken,
                          accountId
                        ),
                      });
                      editCampaign(campaign.id);
                    }}
                  >
                    View
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      editCampaign(campaign.id);
                    }}
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    onClick={async () => {
                      setSnackBarData({
                        message: "Deleting the campaign...",
                        status: "progress",
                      });
                      await wait(2000);
                      setSnackBarData({
                        message: "Error in deleting the campaign!",
                        status: "error",
                      });
                    }}
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [viewAdsetsByCampaign, handleToggle, queryClient, accessToken, accountId]
  );

  return (
    <UiTable<IAdCampaign>
      columns={columns}
      renderCell={renderCell}
      fetchStatus={fetchStatus}
      totalItems={campaigns ?? []}
      pronoun="campaign"
      selectedKeys={selected.campaigns}
      setSelectedKeys={setSelected(CampaignTab.CAMPAIGNS)}
      emptyContent={isFetching ? "" : "No campaigns found"}
      isLoading={isLoading}
      onAddClick={handleAddClick}
      onEditClick={handleEditClick}
      fetchMore={fetchNextPageFn}
      hasMore={hasNextPage}
    />
  );
}
