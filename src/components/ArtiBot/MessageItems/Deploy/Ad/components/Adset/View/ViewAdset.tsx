import { Key, useCallback, useEffect, useState } from "react";
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
import { useGetAdAccountId, useGetAdSets, useGetCampaigns } from "@/api/user";
import { access } from "fs";

const columns = [
  { name: "OFF/ON", uid: "status" },
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "OPTIMIZATION GOAL", uid: "optimization_goal", sortable: true },
  { name: "BID STRATEGY", uid: "bid_strategy" },
  { name: "ACTIONS", uid: "actions" },
];

export default function ViewAdset() {
  const { state } = useUser();
  const accessToken = Platform.getPlatform(
    state.data?.facebook
  ).userAccessToken;
  const { selected, setSelected, viewAdsByAdset } = useCampaignStore();
  const { data: accountId, isFetching: isAccountIdFetching } =
    useGetAdAccountId(accessToken);
  const { data: adsets, isFetching: isAdSetsFetching } = useGetAdSets({
    accountId: accountId,
    accessToken: accessToken,
    campaignIds: Array.from(selected.campaigns) as string[],
  });

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
          return <div className="flex items-center gap-3">{adset.name}</div>;
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
            <div>
              <Switch
                isSelected={cellValue === "ACTIVE"}
                color="primary"
                size="sm"
              ></Switch>
            </div>
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
    [viewAdsByAdset]
  );

  return (
    <UiTable
      columns={columns}
      renderCell={renderCell}
      totalItems={adsets ?? []}
      pronoun="adset"
      selectedKeys={selected.adsets}
      setSelectedKeys={setSelected(CampaignTab.ADSETS)}
      isLoading={isAdSetsFetching || isAccountIdFetching}
      loadingContent={<Loader />}
      emptyContent="No adsets found"
    />
  );
}
