import React, { FC, Key, useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  CheckboxGroup,
  Chip,
  Input,
  Switch,
  cn,
} from "@nextui-org/react";
import { AutoComplete, Divider } from "antd";
import Image from "next/image";
import { carouselImage1 as ProfileImage } from "@/assets/images/carousel-images";
import UserAvatar from "@/assets/images/UserAvatar.webp";
import useCampaignStore, { CampaignTab } from "@/store/campaign";
import useConversations from "@/hooks/useConversations";
import useAdCreatives from "@/hooks/useAdCreatives";
import { useSearchParams } from "next/navigation";
import { difference, sortBy } from "lodash";
import { IAdVariant } from "@/interfaces/IArtiBot";
import everyOneImage from "@/assets/images/case-study/everyone.png";
import {
  useAdImageUpload,
  useCreateAd,
  useCreateFacebookAdCreative,
  useGetAdSets,
  useGetCampaigns,
  useUpdateAd,
  useUserPages,
} from "@/api/user";
import { Platform, useUser } from "@/context/UserContext";
import { useYupValidationResolver } from "@/hooks/useYupValidationResolver";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { imageUrlToBase64 } from "@/utils/transformers";
import { Brand, brands } from "@/constants/landingPageData";
import { RxCross1 } from "react-icons/rx";
import { SlOptionsVertical } from "react-icons/sl";
import { AiOutlineLike } from "react-icons/ai";
import { GoComment } from "react-icons/go";
import { TbShare3 } from "react-icons/tb";
import { IAd } from "@/interfaces/ISocial";
import { getSubmitText } from "../../../CreateAdManagerModal";
import { conditionalData } from "../../Adset/Create/CreateAdset";
import { useCurrentConversation } from "@/context/CurrentConversationContext";

const BILLING_EVENT = [{ name: "Impressions", uid: "impressions" }];

const CUSTOM_AUDIENCES = [
  { name: "Website Audience", uid: "website_audience" },
  { name: "Audience", uid: "audience" },
];

const INSTANT_FORM = [
  { name: "Instant Form", uid: "instant_form" },
  { name: "Create Form", uid: "create_form" },
];

const CTA = [
  { name: "Book Travel", value: "BOOK_TRAVEL" },
  { name: "Contact Us", value: "CONTACT_US" },
  { name: "Donate", value: "DONATE" },
  { name: "Donate Now", value: "DONATE_NOW" },
  { name: "Download", value: "DOWNLOAD" },
  { name: "Get Directions", value: "GET_DIRECTIONS" },
  { name: "Go Live", value: "GO_LIVE" },
  { name: "Interested", value: "INTERESTED" },
  { name: "Learn More", value: "LEARN_MORE" },
  { name: "Like Page", value: "LIKE_PAGE" },
  { name: "Message Page", value: "MESSAGE_PAGE" },
  { name: "Send Message", value: "SEND_MESSAGE" },
  { name: "Raise Money", value: "RAISE_MONEY" },
  { name: "Save", value: "SAVE" },
  { name: "Send Tip", value: "SEND_TIP" },
  { name: "Shop Now", value: "SHOP_NOW" },
  { name: "Sign Up", value: "SIGN_UP" },
  { name: "View Instagram Profile", value: "VIEW_INSTAGRAM_PROFILE" },
  { name: "Instagram Message", value: "INSTAGRAM_MESSAGE" },
  { name: "Loyalty Learn More", value: "LOYALTY_LEARN_MORE" },
  { name: "Purchase Gift Cards", value: "PURCHASE_GIFT_CARDS" },
  { name: "Pay to Access", value: "PAY_TO_ACCESS" },
  { name: "See More", value: "SEE_MORE" },
  { name: "Try in Camera", value: "TRY_IN_CAMERA" },
  { name: "WhatsApp Link", value: "WHATSAPP_LINK" },
  { name: "Book Now", value: "BOOK_NOW" },
  { name: "Check Availability", value: "CHECK_AVAILABILITY" },
  { name: "Order Now", value: "ORDER_NOW" },
  { name: "WhatsApp Message", value: "WHATSAPP_MESSAGE" },
  { name: "Get Mobile App", value: "GET_MOBILE_APP" },
  { name: "Install Mobile App", value: "INSTALL_MOBILE_APP" },
  { name: "Use Mobile App", value: "USE_MOBILE_APP" },
  { name: "Install App", value: "INSTALL_APP" },
  { name: "Use App", value: "USE_APP" },
  { name: "Play Game", value: "PLAY_GAME" },
  { name: "Watch Video", value: "WATCH_VIDEO" },
  { name: "Watch More", value: "WATCH_MORE" },
  { name: "Open Link", value: "OPEN_LINK" },
  { name: "No Button", value: "NO_BUTTON" },
  { name: "Listen Music", value: "LISTEN_MUSIC" },
  { name: "Mobile Download", value: "MOBILE_DOWNLOAD" },
  { name: "Get Offer", value: "GET_OFFER" },
  { name: "Get Offer View", value: "GET_OFFER_VIEW" },
  { name: "Buy Now", value: "BUY_NOW" },
  { name: "Buy Tickets", value: "BUY_TICKETS" },
  { name: "Update App", value: "UPDATE_APP" },
  { name: "Bet Now", value: "BET_NOW" },
  { name: "Add to Cart", value: "ADD_TO_CART" },
  { name: "Sell Now", value: "SELL_NOW" },
  { name: "Get Showtimes", value: "GET_SHOWTIMES" },
  { name: "Listen Now", value: "LISTEN_NOW" },
  { name: "Get Event Tickets", value: "GET_EVENT_TICKETS" },
  { name: "Remind Me", value: "REMIND_ME" },
  { name: "Search More", value: "SEARCH_MORE" },
  { name: "Pre Register", value: "PRE_REGISTER" },
  { name: "Swipe Up Product", value: "SWIPE_UP_PRODUCT" },
  { name: "Swipe Up Shop", value: "SWIPE_UP_SHOP" },
  { name: "Play Game on Facebook", value: "PLAY_GAME_ON_FACEBOOK" },
  { name: "Visit World", value: "VISIT_WORLD" },
  { name: "Open Instant App", value: "OPEN_INSTANT_APP" },
  { name: "Join Group", value: "JOIN_GROUP" },
  { name: "Get Promotions", value: "GET_PROMOTIONS" },
  { name: "Send Updates", value: "SEND_UPDATES" },
  { name: "Inquire Now", value: "INQUIRE_NOW" },
  { name: "Visit Profile", value: "VISIT_PROFILE" },
  { name: "Chat on WhatsApp", value: "CHAT_ON_WHATSAPP" },
  { name: "Explore More", value: "EXPLORE_MORE" },
  { name: "Confirm", value: "CONFIRM" },
  { name: "Join Channel", value: "JOIN_CHANNEL" },
  { name: "Call", value: "CALL" },
  { name: "Missed Call", value: "MISSED_CALL" },
  { name: "Call Now", value: "CALL_NOW" },
  { name: "Call Me", value: "CALL_ME" },
  { name: "Apply Now", value: "APPLY_NOW" },
  { name: "Buy", value: "BUY" },
  { name: "Get Quote", value: "GET_QUOTE" },
  { name: "Subscribe", value: "SUBSCRIBE" },
  { name: "Record Now", value: "RECORD_NOW" },
  { name: "Vote Now", value: "VOTE_NOW" },
  { name: "Give Free Rides", value: "GIVE_FREE_RIDES" },
  { name: "Register Now", value: "REGISTER_NOW" },
  { name: "Open Messenger Ext", value: "OPEN_MESSENGER_EXT" },
  { name: "Event RSVP", value: "EVENT_RSVP" },
  { name: "Civic Action", value: "CIVIC_ACTION" },
  { name: "Send Invites", value: "SEND_INVITES" },
  { name: "Refer Friends", value: "REFER_FRIENDS" },
  { name: "Request Time", value: "REQUEST_TIME" },
  { name: "See Menu", value: "SEE_MENU" },
  { name: "Search", value: "SEARCH" },
  { name: "Try It", value: "TRY_IT" },
  { name: "Try On", value: "TRY_ON" },
  { name: "Link Card", value: "LINK_CARD" },
  { name: "Dial Code", value: "DIAL_CODE" },
  { name: "Find Your Groups", value: "FIND_YOUR_GROUPS" },
  { name: "Start Order", value: "START_ORDER" },
];

const SOCIAL_PAGES = [
  { name: "Michael Scott", uid: "michael_scott" },
  { name: "Dwight Schrute", uid: "dwight_schrute" },
  { name: "Jim Halpert", uid: "jim_halpert" },
  { name: "button", uid: "button" },
];

interface FacebookAdPreviewProps {
  text: string;
  image: string;
  brandLogo?: string;
  brandLabel?: string;
}
const FacebookAdPreview = ({
  text,
  image,
  brandLogo,
  brandLabel,
}: FacebookAdPreviewProps) => {
  return (
    <div
      className={"w-[300px] h-auto bg-gray-800 ad-preview-card py-3"}
      style={
        {
          // "--shadow": "0 0 50px #bebebe45",
        }
      }
    >
      <div className={"flex items-center justify-between px-3 gap-4"}>
        <div className={"flex items-center gap-4"}>
          <div className={"w-7 h-7 rounded-full overflow-hidden"}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={"w-full h-full object-cover"}
              src={brandLogo ?? UserAvatar.src}
              alt={brandLabel ?? "Brand Name"}
            />
          </div>
          <div className={"flex flex-col justify-center gap-1"}>
            <div className={"text-xs text-white font-bold overflow-hidden"}>
              <span className={"truncate block max-w-[160px]"}>
                {brandLabel ?? "Brand Name"}
              </span>
            </div>
            <div className={"flex items-center gap-2"}>
              <span className={"text-[9px] font-light text-gray-300"}>
                Sponsored
              </span>
              <div className={"w-0.5 h-0.5 bg-gray-200 rounded-full"} />
              <Image
                className={"w-2 h-2"}
                src={everyOneImage}
                alt={"Everyone Image"}
              />
            </div>
          </div>
        </div>
        <div
          className={
            "flex items-center gap-3 text-sm text-white cursor-pointer"
          }
        >
          <RxCross1 />
          <SlOptionsVertical />
        </div>
      </div>
      <div className={"text-white text-[11px] mt-1.5 px-3 line-clamp-3"}>
        <span>{text}</span>
      </div>
      <div className={"w-full h-auto mt-2"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={"w-full h-auto"}
          src={image}
          alt={"Amplified Ad Creative"}
        />
      </div>
      {/* <div
        className={"bg-gray-700 py-4 px-3 flex items-center justify-between"}
      >
        <div className={"text-white flex flex-col text-[10px]"}>
          <span>FORM ON FACEBOOK</span>
          <span className={"font-bold"}>{brand.offer}</span>
          <span>{brand.subOffer}</span>
        </div>
        <div>
          <button
            className={
              "py-1.5 px-3 bg-gray-600 rounded text-white text-[13px] font-bold cursor-pointer"
            }
          >
            {brand.cta}
          </button>
        </div>
      </div> */}
      <div
        className={
          "flex text-sm items-center justify-evenly text-white text-[10px] mt-1.5 px-1.5"
        }
      >
        <div className={"flex items-center gap-2 text-[12px]"}>
          <AiOutlineLike />
          <span>Like</span>
        </div>
        <div className={"flex items-center gap-2 text-[12px]"}>
          <GoComment />
          <span>Comment</span>
        </div>
        <div className={"flex items-center gap-2 text-[12px]"}>
          <TbShare3 />
          <span>Share</span>
        </div>
      </div>
    </div>
  );
};

interface CreateAdFormValues {
  campaign_id: string;
  adset_id: string;
  page_id: string;
  adName: string;
  head_line: string;
  primaryText: string;
  callToAction: string;
  status: "ACTIVE" | "PAUSED";
}

const validationSchema = yup.object().shape({
  campaign_id: yup.string().required("Campaign is required"),
  adset_id: yup.string().required("Ad Set is required"),
  page_id: yup.string().required("Page is required"),
  head_line: yup.string().required("Head Line is required"),
  adName: yup.string().required("Ad Name is required"),
  primaryText: yup.string().required("Primary Text is required"),
  callToAction: yup.string().required("Call to Action is required"),
});

export default function CreateAd() {
  const resolver = useYupValidationResolver(validationSchema);
  const { handleSubmit, formState, register, setValue, watch } =
    useForm<CreateAdFormValues>({
      resolver,
    });

  const {
    mutate: postCreateAd,
    isPending: isCreating,
    isSuccess: isCreateSuccess,
  } = useCreateAd();

  const {
    mutate: postUpdateAd,
    isPending: isUpdating,
    isSuccess: isUpdateSuccess,
  } = useUpdateAd();

  const isSuccess = isCreateSuccess || isUpdateSuccess;
  const isPending = isCreating || isUpdating;

  const {
    meta,
    formState: storeFormState,
    selected,
    setFormState,
  } = useCampaignStore();

  const campaignValue = watch("campaign_id");
  const adsetValue = watch("adset_id");
  const adNameValue = watch("adName");
  const primaryTextValue = watch("primaryText");
  const callToActionValue = watch("callToAction");
  const statusValue = watch("status");
  const headlineValue = watch("head_line");

  const [selectedVariantId, setSelectedVariantId] = React.useState<string>("");
  const { data: campaigns, isLoading: isCampaignsFetching } = useGetCampaigns();
  const { data: adsets, isLoading: isAdsetFetching } = useGetAdSets({
    campaignIds: [campaignValue],
  });
  const { state } = useUser();

  const {
    data: pagesData,
    // isError,
    // isSuccess,
    error,
    refetch,
    isLoading: isPagesLoading,
  } = useUserPages();

  const immutableFields = useMemo((): Partial<
    Record<keyof CreateAdFormValues, boolean>
  > => {
    if (storeFormState.mode !== "edit") return {};
    return {
      campaign_id: true,
      adset_id: true,
      callToAction: true,
      page_id: true,
    };
  }, [storeFormState.mode]);

  const pageIdValue = watch("page_id");
  const facebookPages = state.data?.facebook?.pages;

  const { adVariantsByConversationId } = useAdCreatives();
  const searchParams = useSearchParams();
  const [erroredAdVariants, setErroredAdVariants] = useState<IAdVariant[]>([]);

  const { conversation } = useCurrentConversation();
  const conversationId = conversation?.id;

  const unSortedAdCreatives =
    adVariantsByConversationId[conversationId as string].list;
  const adCreatives = sortBy(unSortedAdCreatives, "updatedAt").reverse();

  // const [conversionLocationValue, setConversionLocationValue] = useState<
  //   string | null
  // >(null);

  const selectedVariant = useMemo(() => {
    return unSortedAdCreatives
      .map((adCreative) => adCreative.variants)
      .flat()
      .find((variant) => variant.id === selectedVariantId);
  }, [unSortedAdCreatives, selectedVariantId]);

  useEffect(() => {
    setSelectedVariantId(meta.selectedVariant?.id ?? "");
  }, [meta.selectedVariant?.id]);

  useEffect(() => {
    if (selectedVariant?.oneLiner)
      setValue("adName", selectedVariant?.oneLiner);
    if (selectedVariant?.text) setValue("primaryText", selectedVariant?.text);
  }, [selectedVariant, setValue]);

  // TODO: Fetch the adset conversion location
  const conversionLocationValue = useMemo(() => {
    return null;
    // return adsets?.find((adset) => adset.id === adsetValue)?.conversionLocation;
  }, []);

  async function handleCreateAd(data: CreateAdFormValues) {
    if (!selectedVariant?.imageUrl && storeFormState.mode === "create")
      return null;

    storeFormState.mode === "edit" && storeFormState.open === true
      ? postUpdateAd({
          ad: {
            name: data.adName,
            status: data.status,
            adsetId: data.adset_id,
            creativeId: storeFormState.rawData.creative.id,
          },
          adId: storeFormState.rawData.id,
        })
      : postCreateAd({
          imageUrl: selectedVariant?.imageUrl,
          ad: {
            adsetId: data.adset_id,
            status: data.status,
            campaignId: data.campaign_id,
            name: data.adName,
          },
          adCreativeData: {
            ad_creative: {
              call_to_action_type: data.callToAction,
              message: data.primaryText,
              name: data.adName,
            },
            pageId: data.page_id,
          },
        });
  }

  const previewData = useMemo(() => {
    if (selectedVariant) {
      return {
        text: selectedVariant.text,
        image: selectedVariant.imageUrl,
      };
    }

    if (storeFormState.mode === "edit" && storeFormState.open === true) {
      const formData = storeFormState.rawData as IAd;
      return {
        text: formData.creative.object_story_spec?.link_data?.message ?? "",
        image: formData.creative.image_url ?? "",
      };
    }
  }, [selectedVariant, storeFormState]);

  useEffect(() => {
    if (storeFormState.mode === "edit" && storeFormState.open === true) {
      const formData = storeFormState.rawData as IAd;
      if (!formData) return;
      setValue("campaign_id", formData.campaign.id);
      setValue("adset_id", formData.adset.id);
      setValue("page_id", formData.creative.object_story_spec?.page_id ?? "");
      setValue("adName", formData.name);
      setValue(
        "primaryText",
        formData.creative.object_story_spec?.link_data?.message ?? ""
      );
      setValue(
        "callToAction",
        formData.creative.object_story_spec?.link_data?.call_to_action?.type ??
          ""
      );
      setValue("status", formData.status);
    } else {
      if (selected.campaigns !== "all" && selected.campaigns.size === 1) {
        const campaignId = Array.from(selected.campaigns)[0].toString();
        setValue("campaign_id", campaignId);
      }
      if (selected.adsets !== "all" && selected.adsets.size === 1) {
        const adsetId = Array.from(selected.adsets)[0].toString();
        setValue("adset_id", adsetId);
      }
    }
  }, [storeFormState, selected, setValue]);

  useEffect(() => {
    if (isSuccess) {
      setFormState({ tab: CampaignTab.ADSETS, open: false });
    }
  }, [isSuccess, setFormState]);

  const variants = useMemo(() => {
    return difference(
      unSortedAdCreatives.map((adCreative) => adCreative.variants).flat(),
      erroredAdVariants
    );
  }, [unSortedAdCreatives, erroredAdVariants]);

  const selectedPage = useMemo(() => {
    if (facebookPages && pageIdValue) {
      return facebookPages.find((page) => page.id === pageIdValue);
    }
  }, [pageIdValue, facebookPages]);

  // Check for the image url
  //

  return (
    <form
      onSubmit={handleSubmit(handleCreateAd)}
      className="flex gap-4 pb-6 overflow-auto flex-1"
    >
      <div className="flex flex-col gap-4 justify-between flex-1 h-full">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="!text-gray-500 !text-small">
              Basic Info
            </label>
            <Autocomplete
              inputProps={{
                classNames: {
                  input: "!text-white",
                  label: "!text-gray-500",
                },
              }}
              isDisabled={isCampaignsFetching || immutableFields["campaign_id"]}
              label="Campaign"
              placeholder={
                isCampaignsFetching ? "Fetching Campaigns" : "Select Campaign"
              }
              onSelectionChange={(key: Key) => {
                setValue("campaign_id", key as string);
              }}
              selectedKey={campaignValue}
              errorMessage={formState.errors.campaign_id?.message}
            >
              {campaigns && campaigns.length > 0 ? (
                campaigns.map((campaign) => (
                  <AutocompleteItem key={campaign.id} textValue={campaign.name}>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {campaign.name}
                    </div>
                  </AutocompleteItem>
                ))
              ) : (
                <AutocompleteItem key={"no-country-found"} isReadOnly>
                  No campaigns found
                </AutocompleteItem>
              )}
            </Autocomplete>
            <Autocomplete
              inputProps={{
                classNames: {
                  input: "!text-white",
                  label: "!text-gray-500",
                },
              }}
              isDisabled={
                isAdsetFetching || !campaignValue || immutableFields["adset_id"]
              }
              label="Ad Set"
              placeholder={isAdsetFetching ? "Fetching Adsets" : "Select Adset"}
              onSelectionChange={(key: Key) => {
                setValue("adset_id", key as string);
              }}
              selectedKey={adsetValue}
              errorMessage={formState.errors.adset_id?.message}
            >
              {adsets && adsets.length > 0 ? (
                adsets.map((adset) => (
                  <AutocompleteItem key={adset.id} textValue={adset.name}>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {adset.name}
                    </div>
                  </AutocompleteItem>
                ))
              ) : (
                <AutocompleteItem key={"no-country-found"} isReadOnly>
                  No adsets found
                </AutocompleteItem>
              )}
            </Autocomplete>
            <Divider className="my-2" />

            <Autocomplete
              inputProps={{
                classNames: {
                  input: "!text-white",
                  label: "!text-gray-500",
                },
              }}
              label="Ad Variant"
              placeholder={"Select Ad Variant"}
              onSelectionChange={(key: Key) => {
                setSelectedVariantId(key as string);
              }}
              isRequired={false}
              // disabledKeys={[""]}
              allowsEmptyCollection
              formNoValidate={true}
              selectedKey={selectedVariantId}
              startContent={
                selectedVariant ? (
                  <div className="w-5 h-5 rounded flex-shrink-0 overflow-hidden">
                    <Image
                      className="w-full h-full object-cover"
                      src={selectedVariant.imageUrl}
                      width={30}
                      height={30}
                      alt={"Ad Variant"}
                    />
                  </div>
                ) : null
              }
            >
              {["", ...variants].map((variant) =>
                typeof variant === "string" ? (
                  <AutocompleteItem
                    key={variant}
                    textValue={variant}
                    classNames={{
                      base: "hidden",
                    }}
                  ></AutocompleteItem>
                ) : (
                  <AutocompleteItem
                    key={variant.id}
                    textValue={variant.oneLiner}
                  >
                    <>
                      <div className="w-full flex justify-between gap-2">
                        <div className="flex gap-2">
                          <div className="w-12 flex-shrink-0 h-12 overflow-hidden">
                            <Image
                              className="w-full h-full object-cover hover:object-contain"
                              width={200}
                              height={200}
                              src={variant.imageUrl}
                              alt="Profile Image"
                              onError={() => {
                                setErroredAdVariants((c) => [...c, variant]);
                              }}
                            />
                          </div>
                          <span className="text-small max-w-[170px]">
                            {variant.oneLiner}
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {/* <span className="text-tiny text-default-500">
                              Facebook
                            </span> */}
                          <Chip color="success" size="sm" variant="flat">
                            New
                          </Chip>
                        </div>
                      </div>
                    </>
                  </AutocompleteItem>
                )
              )}
            </Autocomplete>
            <Input
              classNames={{
                label: "!text-gray-500",
              }}
              label="Head Line"
              variant="flat"
              value={headlineValue}
              {...register("head_line")}
              errorMessage={formState.errors.head_line?.message}
            />
            <Input
              classNames={{
                label: "!text-gray-500",
              }}
              label="Ad Name"
              variant="flat"
              value={adNameValue}
              onValueChange={(value: string) => setValue("adName", value)}
              errorMessage={formState.errors.adName?.message}
            />
          </div>
          <Input
            classNames={{
              label: "!text-gray-500",
            }}
            label="Primary Text"
            variant="flat"
            value={primaryTextValue}
            onValueChange={(value: string) => setValue("primaryText", value)}
            errorMessage={formState.errors.primaryText?.message}
          />
          <Autocomplete
            inputProps={{
              classNames: {
                input: "!text-white",
                label: "!text-gray-500",
              },
            }}
            label="Call to Action"
            placeholder={"Select CTA"}
            isDisabled={immutableFields["campaign_id"]}
            onSelectionChange={(key: Key) => {
              setValue("callToAction", key as string);
            }}
            selectedKey={callToActionValue}
            errorMessage={formState.errors.callToAction?.message}
          >
            {CTA.map((cta) => (
              <AutocompleteItem key={cta.value} textValue={cta.name}>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {cta.name}
                </div>
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>
        <div className="w-full flex justify-start gap-2 text-small items-center">
          <Switch
            defaultSelected
            classNames={{
              // wrapper: "flex w-full justify-between items-center gap-3",
              label: "!text-gray-300 !text-small",
            }}
            color="primary"
            size="sm"
            onValueChange={(value) => {
              setValue("status", value ? "ACTIVE" : "PAUSED");
            }}
            isSelected={statusValue === "ACTIVE"}
          >
            Active
          </Switch>
        </div>

        <Button isLoading={isPending} type="submit" color="primary">
          <span>{getSubmitText(storeFormState, isPending, "Ad")}</span>
        </Button>
      </div>

      <div className="flex flex-col gap-4 flex-1 space-between">
        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          <div className="flex justify-center">
            {previewData ? (
              <FacebookAdPreview
                text={previewData.text}
                image={previewData.image}
                brandLabel={selectedPage?.name}
                brandLogo={selectedPage?.picture}
              />
            ) : (
              <div className="w-[300px] h-[400px] rounded-lg bg-gray-800 flex items-center justify-center text-lg text-gray-600">
                <p>Select Ad variant to preview</p>
              </div>
            )}
          </div>
          {/* <AdPreview3 brand={brands["amplified"]} /> */}
          <Divider className="my-2" />
          {conversionLocationValue === "WEBSITE" && (
            <Input
              classNames={{
                label: "!text-gray-500",
              }}
              label="Website Url"
              variant="flat"
              // value={primaryTextValue}
              // onValueChange={(value: string) => setValue("primaryText", value)}
              // errorMessage={formState.errors.primaryText?.message}
            />
          )}
          {conversionLocationValue === "APP" && (
            <Input
              classNames={{
                label: "!text-gray-500",
              }}
              label="App Url"
              variant="flat"
              // value={primaryTextValue}
              // onValueChange={(value: string) => setValue("primaryText", value)}
              // errorMessage={formState.errors.primaryText?.message}
            />
          )}
          {conversionLocationValue === "CALLS" && (
            <Input
              classNames={{
                label: "!text-gray-500",
              }}
              label="Phone Number"
              variant="flat"
              // value={primaryTextValue}
              // onValueChange={(value: string) => setValue("primaryText", value)}
              // errorMessage={formState.errors.primaryText?.message}
            />
          )}
          {conversionLocationValue === "INSTANT_FORM" && (
            <Autocomplete
              inputProps={{
                classNames: {
                  input: "!text-white",
                  label: "!text-gray-500",
                },
              }}
              label="Instant Form"
              placeholder={"Select Form"}
              isDisabled={immutableFields["campaign_id"]}
              disabledKeys={["create_form"]}
              // onSelectionChange={(key: Key) => {
              //   setValue("callToAction", key as string);
              // }}
              // selectedKey={callToActionValue}
              // errorMessage={formState.errors.callToAction?.message}
            >
              {/* @ts-ignore */}
              {INSTANT_FORM.map((cta) => (
                <AutocompleteItem key={cta.uid} textValue={cta.name}>
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {cta.name}
                  </div>
                </AutocompleteItem>
              ))}

              {/* @ts-ignore */}
              <AutocompleteItem
                style={{ pointerEvents: "all", cursor: "default !important" }}
                key={"create_form"}
                textValue={"create_form"}
              >
                <div className="flex cursor-pointer items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <Button color="primary" className="w-full">
                    Create Form
                  </Button>
                </div>
              </AutocompleteItem>
            </Autocomplete>
          )}
          <Autocomplete
            inputProps={{
              classNames: {
                input: "!text-white",
                label: "!text-gray-500",
              },
            }}
            isDisabled={isPagesLoading || immutableFields["page_id"]}
            label="Social Media Page"
            placeholder={isPagesLoading ? "Fetching Pages..." : "Select a Page"}
            onSelectionChange={(key: Key) => {
              setValue("page_id", key as string);
            }}
            selectedKey={pageIdValue}
            errorMessage={formState.errors.page_id?.message}
          >
            <>
              {facebookPages && facebookPages.length > 0 ? (
                facebookPages.map((page) => (
                  <AutocompleteItem key={page.id} textValue={page.name}>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={page.picture} className="w-6 h-6" alt="Page" />
                      {page.name}
                    </div>
                  </AutocompleteItem>
                ))
              ) : (
                <AutocompleteItem key={"no-page-found"} isReadOnly>
                  No pages found
                </AutocompleteItem>
              )}
              <AutocompleteItem key={"no-page-found"} isReadOnly>
                Create Form
              </AutocompleteItem>
            </>
          </Autocomplete>
        </div>
      </div>
    </form>
  );
}
