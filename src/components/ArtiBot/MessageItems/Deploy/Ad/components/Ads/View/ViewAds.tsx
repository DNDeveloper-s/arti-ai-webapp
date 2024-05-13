import {
  Key,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../../../api/arti_api";
import Loader from "@/components/Loader";
import { Platform, useUser } from "@/context/UserContext";

import useCampaignStore, { CampaignTab } from "@/store/campaign";
import {
  useGetAdAccountId,
  useGetAdSets,
  useGetAds,
  useUpdateAd,
} from "@/api/user";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Snippet,
  Switch,
  useDisclosure,
} from "@nextui-org/react";
import { FaEllipsisVertical } from "react-icons/fa6";
import UiTable from "@/components/shared/renderers/UiTable";
import CreateAdset from "../../Adset/Create/CreateAdset";
import {
  ADMANAGER_STATUS_TYPE,
  IAd,
  IFacebookAdInsight,
  OptimisationGoal,
} from "@/interfaces/ISocial";
import { SnackbarContext } from "@/context/SnackbarContext";
import SwitchStatus from "../../SwitchStatus";
import { wait } from "@/helpers";
import { useDeleteAd } from "@/api/admanager";

const columns = [
  { name: "OFF/ON", uid: "status" },
  { name: "IMAGE", uid: "image" },
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "AMOUNT SPENT", uid: "amount_spent", sortable: true },
  { name: "REACH", uid: "reach" },
  { name: "RESULTS", uid: "results" },
  // { name: "BID AMOUNT", uid: "bid_amount" },
  // { name: "SHAREABLE LINK", uid: "preview_shareable_link" },
  // { name: "AD ACTIVE TIME", uid: "ad_active_time" },
  { name: "ACTIONS", uid: "actions" },
];

const resultKey: Partial<
  Record<OptimisationGoal, { key: string; name: string }>
> = {
  LEAD_GENERATION: {
    key: "lead",
    name: "Leads",
  },
  OFFSITE_CONVERSIONS: {
    key: "offsite_conversion.fb_pixel_custom",
    name: "Conversions",
  },
};

export function getResultsFromInsights(
  insights: IAd["insights"],
  optimizationGoal: OptimisationGoal
) {
  let results = "";
  if (insights === undefined) return results;
  insights.data.forEach((insight) => {
    if (!insight) return;
    const action = insight.actions?.find(
      (action) => action.action_type === resultKey[optimizationGoal]?.key
    );
    if (action) {
      results += action.value + " " + resultKey[optimizationGoal]?.name;
    }
  });
  return results;
}

export default function ViewAds() {
  const [, setSnackBarData] = useContext(SnackbarContext).snackBarData;
  const { selected, setSelected, setFormState, setShowProgress } =
    useCampaignStore();

  const adsetIds = Array.from(selected.adsets) as string[];
  const filters = {
    adsetIds: adsetIds,
    campaignIds:
      adsetIds && adsetIds.length > 0
        ? undefined
        : (Array.from(selected.campaigns) as string[]),
  };
  const {
    data: _adsPages,
    isFetching,
    isLoading,
    fetchStatus,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetAds({
    ...filters,
  });

  const fetchNextPagnFn = useCallback(() => {
    if (!isFetching && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isFetching, fetchNextPage, isFetchingNextPage]);

  const _ads = useMemo(
    () => _adsPages?.pages.map((page) => page.data).flat() ?? [],
    [_adsPages]
  );

  const { mutate: postUpdateAd, isPending: isUpdating } = useUpdateAd();
  const { mutate: postDeleteAd } = useDeleteAd();

  const handleToggle = useCallback(
    (id: string, status: ADMANAGER_STATUS_TYPE, ad: IAd) => {
      postUpdateAd({
        ad: {
          status,
          name: ad.name,
          creative_id: ad.creative.id,
          adset_id: ad.adset.id,
        },
        adId: id,
        onSuccess: {
          snackbarData: {
            status: status === "PAUSED" ? "warning" : "info",
            message: "Ad is now " + status + "",
          },
        },
        onError: {
          snackbarData: {
            status: "error",
            message: "Failed to update Ad",
          },
        },
      });
    },
    [postUpdateAd]
  );

  const ads = useMemo(() => {
    return _ads?.map((ad) => ({
      ...ad,
      image: ad.creative.image_url,
    }));
  }, [_ads]);

  useEffect(() => {
    setShowProgress(isUpdating);
  }, [isUpdating, setShowProgress]);
  //   const [campaignList, setCampaignList] = useState<Campaign[]>([]);
  //   const [isLoading, setLoadingState] = useState(true);
  //   const [errorMessage, setErrorMessage] = useState("");

  const editAd = useCallback(
    (adId: string) => {
      try {
        const currentAd = ads?.find((ad: IAd) => ad.id === adId);

        if (!currentAd) {
          throw new Error("Please select a single ad to edit");
        }

        setFormState({
          tab: CampaignTab.ADS,
          open: true,
          mode: "edit",
          rawData: currentAd,
        });
      } catch (e: any) {
        setSnackBarData({
          status: "error",
          message: e.message,
        });
      }
    },
    [ads, setFormState, setSnackBarData]
  );

  function handleAddClick() {
    setFormState({
      open: true,
      tab: CampaignTab.ADS,
      mode: "create",
    });
  }

  function handleEditClick() {
    try {
      const currentAdId =
        selected.ads instanceof Set &&
        (selected.ads.values().next().value as string);

      if (!currentAdId) {
        throw new Error("Please select a single ad to edit");
      }

      editAd(currentAdId);
    } catch (e: any) {
      setSnackBarData({
        status: "error",
        message: e.message,
      });
    }
  }

  const renderCell = useCallback(
    (ad: IAd, columnKey: Key): ReactNode => {
      const cellValue = Object.hasOwn(ad, columnKey)
        ? ad[columnKey as keyof IAd]
        : "";

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
        case "image":
          return (
            <div className="w-8 h-8 overflow-hidden rounded">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cellValue}
                alt="Ad Image"
                className="object-cover w-full h-full"
              />
            </div>
          );
        case "name":
          return (
            <div className="flex w-[150px] line-clamp-3 items-center gap-3">
              {ad.name}
            </div>
          );
        case "amount_spent":
          return (
            <div className="flex items-center gap-3">
              {ad.insights?.data[0]?.spend}
            </div>
          );
        case "reach":
          return (
            <div className="flex items-center gap-3">
              {ad.insights?.data[0]?.reach}
            </div>
          );
        case "results":
          return (
            <div className="flex items-center gap-3">
              {getResultsFromInsights(
                ad.insights,
                ad.adset.optimization_goal as OptimisationGoal
              )}
            </div>
          );
        case "status":
          return (
            <SwitchStatus
              onToggle={(status: ADMANAGER_STATUS_TYPE) =>
                handleToggle(ad.id, status, ad)
              }
              value={cellValue as any}
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
                      // queryClient.invalidateQueries({
                      //   queryKey: API_QUERIES.GET_CAMPAIGNS(
                      //     accessToken,
                      //     accountId
                      //   ),
                      // });
                      editAd(ad.id);
                    }}
                  >
                    View
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      editAd(ad.id);
                    }}
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    onClick={async () => {
                      postDeleteAd(ad.id);
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
    [editAd, handleToggle, postDeleteAd]
  );

  return (
    <>
      <UiTable<IAd>
        columns={columns}
        renderCell={renderCell}
        totalItems={ads ?? []}
        pronoun="ad"
        selectedKeys={selected.ads}
        setSelectedKeys={setSelected(CampaignTab.ADS)}
        isLoading={isLoading}
        fetchStatus={fetchStatus}
        emptyContent="No ads found"
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        hasMore={hasNextPage}
        fetchMore={fetchNextPagnFn}
      />
    </>
  );
}
