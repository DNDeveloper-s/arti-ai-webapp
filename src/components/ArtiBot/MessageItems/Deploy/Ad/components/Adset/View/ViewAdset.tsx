import { Key, useCallback, useContext, useEffect, useState } from "react";
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
  useGetAdAccountId,
  useGetAdSets,
  useGetCampaigns,
  useUpdateAdset,
} from "@/api/user";
import { access } from "fs";
import {
  ADMANAGER_STATUS_TYPE,
  IAdSet,
  OptimisationGoal,
} from "@/interfaces/ISocial";
import { SnackbarContext } from "@/context/SnackbarContext";
import SwitchStatus from "../../SwitchStatus";
import { getResultsFromInsights } from "../../Ads/View/ViewAds";

const columns = [
  { name: "OFF/ON", uid: "status" },
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "AMOUNT SPENT", uid: "amount_spent", sortable: true },
  { name: "REACH", uid: "reach" },
  { name: "RESULTS", uid: "results" },
  { name: "ACTIONS", uid: "actions" },
];

export default function ViewAdset() {
  const [, setSnackBarData] = useContext(SnackbarContext).snackBarData;
  const {
    setFormState,
    setShowProgress,
    selected,
    setSelected,
    viewAdsByAdset,
  } = useCampaignStore();
  const {
    data: adsets,
    isFetching,
    fetchStatus,
  } = useGetAdSets({
    campaignIds: Array.from(selected.campaigns) as string[],
  });

  const { mutate: postUpdateAdset, isPending: isUpdating } = useUpdateAdset();

  const handleToggle = useCallback(
    (id: string, status: ADMANAGER_STATUS_TYPE) => {
      postUpdateAdset({
        adset: { status },
        adsetId: id,
        onSuccess: {
          snackbarData: {
            status: status === "PAUSED" ? "warning" : "info",
            message: "AdSet is now " + status + "",
          },
        },
        onError: {
          snackbarData: {
            status: "error",
            message: "Failed to update AdSet",
          },
        },
      });
    },
    [postUpdateAdset]
  );

  useEffect(() => {
    setShowProgress(isUpdating);
  }, [isUpdating, setShowProgress]);

  const renderCell = useCallback(
    (adset: any, columnKey: Key) => {
      const cellValue = adset[columnKey];

      switch (columnKey) {
        case "id":
          return (
            <div className="h-full w-full">
              <Link
                color="primary"
                href="#"
                onClick={(e: any) => {
                  e.preventDefault();
                  viewAdsByAdset(cellValue);
                }}
                showAnchorIcon
                className="text-small h-full leading-[3] hover:underline"
              >
                {adset.id}
              </Link>
            </div>
          );
        case "name":
          return (
            <div className="flex items-center gap-3 min-w-[120px]">
              {adset.name}
            </div>
          );
        case "amount_spent":
          return (
            <div className="flex items-center gap-3">
              {adset.insights?.data[0]?.spend}
            </div>
          );
        case "reach":
          return (
            <div className="flex items-center gap-3">
              {adset.insights?.data[0]?.reach}
            </div>
          );
        case "results":
          return (
            <div className="flex items-center gap-3">
              {getResultsFromInsights(
                adset.insights,
                adset.optimization_goal as OptimisationGoal
              )}
            </div>
          );
        case "objective":
          return (
            <div className="flex flex-col">
              {/* <p className="text-bold text-small capitalize">{cellValue}</p> */}
              <p className="text-bold text-tiny capitalize text-default-500">
                {adset.objective}
              </p>
            </div>
          );
        case "status":
          return (
            <SwitchStatus
              onToggle={(status: ADMANAGER_STATUS_TYPE) =>
                handleToggle(adset.id, status)
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
                  <DropdownItem>View</DropdownItem>
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
    [viewAdsByAdset, handleToggle]
  );

  function handleAddClick() {
    setFormState({
      open: true,
      tab: CampaignTab.ADSETS,
      mode: "create",
    });
  }

  function handleEditClick() {
    try {
      const currentAdsetId =
        selected.adsets instanceof Set &&
        (selected.adsets.values().next().value as string);

      const currentAdset = adsets?.find(
        (adset: IAdSet) => adset.id === currentAdsetId
      );

      if (!currentAdset) {
        throw new Error("Please select a single adset to edit");
      }

      setFormState({
        tab: CampaignTab.ADSETS,
        open: true,
        mode: "edit",
        rawData: currentAdset,
      });
    } catch (e: any) {
      setSnackBarData({
        status: "error",
        message: e.message,
      });
    }
  }

  return (
    <UiTable
      columns={columns}
      renderCell={renderCell}
      totalItems={adsets ?? []}
      pronoun="adset"
      selectedKeys={selected.adsets}
      setSelectedKeys={setSelected(CampaignTab.ADSETS)}
      isLoading={isFetching}
      emptyContent="No adsets found"
      onAddClick={handleAddClick}
      onEditClick={handleEditClick}
      fetchStatus={fetchStatus}
    />
  );
}
