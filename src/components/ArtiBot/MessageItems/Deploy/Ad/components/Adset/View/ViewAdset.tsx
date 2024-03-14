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
import useCampaignStore from "@/store/campaign";
import { Platform, useUser } from "@/context/UserContext";
import { useGetAdAccountId, useGetAdSets, useGetCampaigns } from "@/api/user";
import { access } from "fs";

const delay = (delay: number) =>
  new Promise((res) => {
    setTimeout(res, delay);
  });

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "OBJECTIVE", uid: "objective" },
  { name: "OFF/ON", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const _campaigns = [
  {
    name: "Thanks",
    status: "ACTIVE",
    objective: "OUTCOME_AWARENESS",
    effective_status: "ACTIVE",
    id: "120207263113910084",
  },
  {
    name: "dsf",
    status: "ACTIVE",
    objective: "OUTCOME_AWARENESS",
    effective_status: "ACTIVE",
    id: "120206519264600084",
  },
  {
    name: "dsf",
    status: "ACTIVE",
    objective: "OUTCOME_AWARENESS",
    effective_status: "ACTIVE",
    id: "120206519260610084",
  },
  {
    name: "dsf",
    status: "ACTIVE",
    objective: "OUTCOME_AWARENESS",
    effective_status: "ACTIVE",
    id: "120206519215920084",
  },
  {
    name: "dsf",
    status: "ACTIVE",
    objective: "OUTCOME_AWARENESS",
    effective_status: "ACTIVE",
    id: "120206519183410084",
  },
  {
    name: "dsf",
    status: "PAUSED",
    objective: "OUTCOME_AWARENESS",
    effective_status: "PAUSED",
    id: "120206519170830084",
  },
  {
    name: "dsf",
    status: "ACTIVE",
    objective: "OUTCOME_AWARENESS",
    effective_status: "ACTIVE",
    id: "120206519149050084",
  },
  {
    name: "dsf",
    status: "ACTIVE",
    objective: "OUTCOME_AWARENESS",
    effective_status: "ACTIVE",
    id: "120206519079550084",
  },
  {
    name: "abc",
    status: "ACTIVE",
    objective: "OUTCOME_AWARENESS",
    effective_status: "ACTIVE",
    id: "120206519075380084",
  },
  {
    name: "abc",
    status: "ACTIVE",
    objective: "OUTCOME_AWARENESS",
    effective_status: "ACTIVE",
    id: "120206519011320084",
  },
  {
    name: "abc",
    status: "ACTIVE",
    objective: "OUTCOME_AWARENESS",
    effective_status: "ACTIVE",
    id: "120206518905820084",
  },
  {
    name: "abc",
    status: "ACTIVE",
    objective: "OUTCOME_AWARENESS",
    effective_status: "ACTIVE",
    id: "120206518880620084",
  },
  {
    name: "Test Campaign",
    status: "ACTIVE",
    objective: "OUTCOME_APP_PROMOTION",
    effective_status: "ACTIVE",
    id: "120206440505380084",
  },
];

export default function ViewAdset() {
  const { state } = useUser();
  const accessToken = Platform.getPlatform(
    state.data?.facebook
  ).userAccessToken;
  const { data: accountId } = useGetAdAccountId(accessToken);
  const { data: campaigns } = useGetAdSets({
    accountId: accountId,
    accessToken: accessToken,
    campaignId: "120206440505380084",
  });

  useEffect(() => {
    console.log("testing || accessToken - ", accessToken);
  }, [accessToken]);

  useEffect(() => {
    console.log("testing || campaigns - ", campaigns);
  }, [campaigns]);

  useEffect(() => {
    console.log("testing || accountId - ", accountId);
  }, [accountId]);
  //   const [campaignList, setCampaignList] = useState<Campaign[]>([]);
  //   const [isLoading, setLoadingState] = useState(true);
  //   const [errorMessage, setErrorMessage] = useState("");
  const { selectedKeys, setSelectedKeys } = useCampaignStore();
  const renderCell = useCallback((campaign: any, columnKey: Key) => {
    const cellValue = campaign[columnKey];

    switch (columnKey) {
      case "id":
        return (
          <div className="h-full w-full">
            <Link
              color="primary"
              href="#"
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
  }, []);

  return (
    <UiTable
      columns={columns}
      renderCell={renderCell}
      totalItems={campaigns ?? []}
      pronoun="campaign"
      selectedKeys={selectedKeys}
      setSelectedKeys={setSelectedKeys}
    />
  );
}
