import { Key, useCallback, useEffect, useState } from "react";
import api from "../../../api/arti_api";
import Loader from "@/components/Loader";
import { Platform, useUser } from "@/context/UserContext";

import useCampaignStore, { CampaignTab } from "@/store/campaign";
import { useGetAdAccountId, useGetAdSets, useGetAds } from "@/api/user";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Snippet,
  Switch,
} from "@nextui-org/react";
import { FaEllipsisVertical } from "react-icons/fa6";
import UiTable from "@/components/shared/renderers/UiTable";

const columns = [
  { name: "OFF/ON", uid: "status" },
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "BID AMOUNT", uid: "bid_amount" },
  { name: "SHAREABLE LINK", uid: "preview_shareable_link" },
  { name: "AD ACTIVE TIME", uid: "ad_active_time" },
  { name: "ACTIONS", uid: "actions" },
];

export default function ViewAds() {
  const { state } = useUser();
  const accessToken = Platform.getPlatform(
    state.data?.facebook
  ).userAccessToken;
  const { selected, setSelected } = useCampaignStore();
  const { data: accountId, isFetching: isAccountIdFetching } =
    useGetAdAccountId(accessToken);
  const { data: ads, isFetching: isAdsFetching } = useGetAds({
    accountId: accountId,
    accessToken: accessToken,
    adSetIds: Array.from(selected.adsets) as string[],
  });
  //   const [campaignList, setCampaignList] = useState<Campaign[]>([]);
  //   const [isLoading, setLoadingState] = useState(true);
  //   const [errorMessage, setErrorMessage] = useState("");
  const renderCell = useCallback((ad: any, columnKey: Key) => {
    const cellValue = ad[columnKey];

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
              {ad.id}
            </Link>
          </div>
        );
      case "name":
        return <div className="flex items-center gap-3">{ad.name}</div>;
      case "preview_shareable_link":
        return (
          <Snippet
            hideSymbol
            color="default"
            size="sm"
            classNames={{
              copyButton: "!w-[24px] !w-[24px] !min-w-[unset] !min-h-[unset]",
              content: "!font-diatype",
            }}
          >
            {cellValue}
          </Snippet>
        );
      case "objective":
        return (
          <div className="flex flex-col">
            {/* <p className="text-bold text-small capitalize">{cellValue}</p> */}
            <p className="text-bold text-tiny capitalize text-default-500">
              {ad.objective}
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
      totalItems={ads ?? []}
      pronoun="ad"
      selectedKeys={selected.ads}
      setSelectedKeys={setSelected(CampaignTab.ADS)}
      isLoading={isAdsFetching || isAccountIdFetching}
      loadingContent={<Loader />}
      emptyContent="No ads found"
    />
  );
}
