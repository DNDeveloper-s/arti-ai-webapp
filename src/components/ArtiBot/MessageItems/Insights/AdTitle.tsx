import { IAd } from "@/interfaces/ISocial";
import { PreviewProps } from "../Deploy/Ad/components/Ads/Create/CreateAd";
import { useRouter } from "next/navigation";
import useCampaignStore, { CampaignTab } from "@/store/campaign";
import { SnackbarContext } from "@/context/SnackbarContext";
import { Key, useCallback, useContext, useMemo, useState } from "react";
import { useFetchLeadsData, useGetAdIdentifiers } from "@/api/admanager";
import { handleDownload } from "./DeployAdInsightsCard";
import { botData } from "@/constants/images";
import { MdDownload, MdEdit, MdRemoveRedEye } from "react-icons/md";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
} from "@nextui-org/react";
import { RiExternalLinkFill, RiListView } from "react-icons/ri";
import AdPreviewModal from "../../v2/AdPreviewModal";
import { useGetVariant } from "@/api/conversation";
import { SlOptionsVertical } from "react-icons/sl";
import { compact } from "lodash";
import ViewLeads from "./ViewLeads";

function AdPreviewWithAdId({
  ad_id,
  handlePreview,
  previewLink,
}: {
  ad_id?: string;
  handlePreview?: (props: PreviewProps) => void;
  previewLink?: string;
}) {
  const { data, isFetching } = useGetVariant({ ad_id });
  return isFetching ? (
    <Spinner size="sm" />
  ) : (
    data?.imageUrl && (
      <div className="flex items-center gap-1">
        <MdRemoveRedEye
          className="text-xl cursor-pointer"
          onClick={async (e: any) => {
            e.stopPropagation();
            const previewProps: PreviewProps = {
              image: data?.imageUrl,
              text: data?.text,
              previewLink: previewLink,
            };
            handlePreview && handlePreview(previewProps);
          }}
        />
        <span>Preview</span>
      </div>
    )
  );
}

type AdOptionAction = "edit" | "preview" | "redirect" | "download";
interface AdOptionItem {
  key: AdOptionAction;
  label: string;
  startContent?: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
}
interface AdOptionsProps {
  handleAction: (key: AdOptionAction) => void;
  items: AdOptionItem[];
}
function AdOptions(props: AdOptionsProps) {
  const handleAction = useCallback(
    (key: Key) => {
      props.handleAction(key as AdOptionAction);
    },
    [props]
  );

  return (
    <Dropdown>
      <DropdownTrigger>
        <div>
          <SlOptionsVertical />
        </div>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Dynamic Actions"
        items={props.items}
        onAction={handleAction}
        disabledKeys={props.items.reduce((acc, item) => {
          if (item.disabled) acc.push(item.key);
          return acc;
        }, [] as Key[])}
      >
        {(item) => (
          <DropdownItem key={item.key} startContent={item.startContent}>
            {item.children ?? item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}

export default function AdTitle({
  ad,
  ad_account_id,
}: {
  ad: IAd;
  ad_account_id?: string;
  handlePreview?: (props: PreviewProps) => void;
}) {
  const router = useRouter();
  const { setFormState, setSelectAdAccount } = useCampaignStore();

  const [open, setOpen] = useState(false);
  const [openViewLeads, setOpenViewLeads] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewProps | null>(null);

  const { data: variantData, isFetching } = useGetVariant({
    ad_id: ad.id,
    enabled: !ad.creative.image_url,
  });

  const handlePreview = useCallback((previeProps: PreviewProps) => {
    setPreviewData(previeProps);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleViewLeadsClose = useCallback(() => {
    setOpenViewLeads(false);
  }, [setOpenViewLeads]);

  const { data: adIdentifierMap, isFetching: isAdIdentifierFetching } =
    useGetAdIdentifiers({ ad_id: ad.id });

  const handleAction = useCallback(
    (action: AdOptionAction) => {
      console.log("action - ", action);
      switch (action) {
        case "edit":
          if (!ad_account_id) break;
          setSelectAdAccount(ad_account_id);
          setFormState({
            open: true,
            mode: "edit",
            rawData: ad,
            tab: CampaignTab.ADS,
          });
          break;
        case "preview":
          if (ad.creative.image_url) {
            handlePreview({
              image: ad.creative.image_url,
              text: ad.creative.object_story_spec?.link_data?.message ?? "",
              previewLink: ad.preview_shareable_link,
            });
          } else {
            handlePreview({
              image: variantData?.imageUrl ?? botData.image.src,
              text: variantData?.text ?? "",
              previewLink: ad.preview_shareable_link,
            });
          }
          break;
        case "redirect":
          if (adIdentifierMap) {
            router.push(
              `/artibot?conversation_type=ad_creative&conversation_id=${adIdentifierMap.conversationId}&message_id=${adIdentifierMap.messageId}`
            );
          }
          break;
        case "download":
          setOpenViewLeads(true);
          // setSnackbarData({
          //   status: "progress",
          //   message: "Downloading data...",
          // });
          // fetchLeadsData({
          //   type: "ad_entities",
          //   id: ad?.id,
          // });
          break;
      }
    },
    [
      ad,
      adIdentifierMap,
      ad_account_id,
      handlePreview,
      router,
      setFormState,
      setSelectAdAccount,
      variantData?.imageUrl,
      variantData?.text,
    ]
  );

  const items: AdOptionItem[] = useMemo(() => {
    return compact([
      !!ad_account_id &&
        !!ad && {
          key: "edit",
          label: "Edit",
          startContent: <MdEdit className="text-xl" />,
        },
      {
        key: "preview",
        label: "Preview",
        children: (
          <div className="flex items-center gap-2">
            <MdRemoveRedEye className="text-xl" />
            <span>Preview</span>
          </div>
        ),
      },
      {
        key: "redirect",
        label: "Redirect to the Chat",
        children: isAdIdentifierFetching ? (
          <Spinner size="sm" />
        ) : (
          <div className="flex items-center gap-2">
            <RiExternalLinkFill className="text-xl cursor-pointer" />
            <span>See in Conversation</span>
          </div>
        ),
        disabled: isAdIdentifierFetching,
      },
      ad.id && {
        key: "download",
        label: "View Leads",
        children: (
          <div className="flex items-center gap-2">
            <RiListView className="text-xl" />
            <span>View Leads</span>
          </div>
        ),
      },
    ]);
  }, [ad, ad_account_id, isAdIdentifierFetching]);

  return (
    <div
      className="flex justify-between items-start fioverflow-hidden"
      data-adid={ad.id}
    >
      <div className="flex gap-4 items-center ">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {/* <img
          alt="Image"
          src="https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?cs=srgb&dl=pexels-guillaume-meurice-1591447.jpg&fm=jpg"
        /> */}
        <Avatar
          isBordered
          color="default"
          radius="sm"
          classNames={{
            base: "flex-shrink-0",
          }}
          src={
            ad.creative.thumbnail_url ??
            ad.creative.image_url ??
            botData.image.src
          }
        />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">{ad.name}</span>
          {/* <span className="text-xs opacity-60 line-clamp-2">
              {ad.creative.object_story_spec?.link_data?.message ?? (
                <span className="opacity-40"></span>
              )}
            </span> */}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <AdOptions items={items} handleAction={handleAction} />
      </div>
      <AdPreviewModal
        open={open}
        handleClose={handleClose}
        previewData={previewData}
      />
      <ViewLeads
        open={openViewLeads}
        handleClose={handleViewLeadsClose}
        ad={ad}
      />
    </div>
  );
}
