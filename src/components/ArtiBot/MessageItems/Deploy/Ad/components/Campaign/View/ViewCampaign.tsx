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
  const { data: campaigns, isFetching, fetchStatus } = useGetCampaigns();
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
                    }}
                  >
                    View
                  </DropdownItem>
                  <DropdownItem>Edit</DropdownItem>
                  <DropdownItem>Delete</DropdownItem>
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

  function handleAddClick() {
    setFormState({ tab: CampaignTab.CAMPAIGNS, open: true, mode: "create" });
  }

  function handleEditClick() {
    try {
      const currentCampaignId =
        selected.campaigns instanceof Set &&
        (selected.campaigns.values().next().value as string);

      const currentCampaign = campaigns?.find(
        (campaign: IAdCampaign) => campaign.id === currentCampaignId
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
      isLoading={isFetching}
      onAddClick={handleAddClick}
      onEditClick={handleEditClick}
    />
  );
}
