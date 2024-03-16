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
import { useGetAdAccountId, useGetCampaigns } from "@/api/user";
import { access } from "fs";

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
  const { state } = useUser();
  const accessToken = Platform.getPlatform(
    state.data?.facebook
  ).userAccessToken;
  const { data: accountId, isFetching: isAccountIdFetching } =
    useGetAdAccountId(accessToken);
  const { data: campaigns, isFetching: isCampaignsFetching } = useGetCampaigns({
    accountId: accountId,
    accessToken: accessToken,
  });

  const { selected, setSelected, viewAdsetsByCampaign } = useCampaignStore();

  const renderCell = useCallback(
    (campaign: any, columnKey: Key) => {
      const cellValue = campaign[columnKey];

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
    [viewAdsetsByCampaign]
  );

  //   useEffect(() => {
  //     const queryData = async () => {
  //       setCampaignList([]);
  //       await delay(1000);
  //       initializeCampaignList();
  //     };

  //     queryData();
  //   }, []);

  //   async function initializeCampaignList() {
  //     setLoadingState(true);

  //     try {
  //       const { adAccountId, getAdAccountIdError } =
  //         await api.getAdAccountId(accessToken);

  //       if (getAdAccountIdError) {
  //         setErrorMessage(getAdAccountIdError);
  //         return;
  //       }

  //       const { data, getAllCampaignsError } = await api.getAllCampaigns(
  //         adAccountId!,
  //         accessToken
  //       );

  //       if (getAllCampaignsError) {
  //         setErrorMessage(getAllCampaignsError);
  //       } else {
  //         setCampaignList(data);
  //       }
  //     } finally {
  //       setLoadingState(false);
  //     }
  //   }

  const isFetching = isAccountIdFetching || isCampaignsFetching;
  return (
    <UiTable
      columns={columns}
      renderCell={renderCell}
      totalItems={campaigns ?? []}
      pronoun="campaign"
      selectedKeys={selected.campaigns}
      setSelectedKeys={setSelected(CampaignTab.CAMPAIGNS)}
      emptyContent={isFetching ? "" : "No campaigns found"}
      isLoading={isFetching}
    />
  );
}
