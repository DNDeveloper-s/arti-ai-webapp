import { ICreateAdset, useCreateAdset, useGetCampaigns } from "@/api/user";
import { useYupValidationResolver } from "@/hooks/useYupValidationResolver";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Switch,
} from "@nextui-org/react";
import { DatePicker } from "antd";
import { Key, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { object, string, mixed, number } from "yup";
import SelectCountries from "./SelectCountries";
import SelectZipCodes from "./SelectZipCodes";
import { Platform, useUser } from "@/context/UserContext";
import dayjs, { Dayjs } from "dayjs";
import Element from "@/components/shared/renderers/Element";
import useCampaignStore, { CampaignTab } from "@/store/campaign";
import SelectInterests from "./SelectInterests";
import { omit } from "lodash";

{
  /* <option value="">None</option>
<option value="APP_INSTALLS">App Installs</option>
<option value="AD_RECALL_LIFT">Ad Recall Lift</option>
<option value="ENGAGED_USERS">Engaged Users</option>
<option value="EVENT_RESPONSES">Event Responses</option>
<option value="IMPRESSIONS">Impressions</option>
<option value="LEAD_GENERATION">Lead Generation</option>
<option value="LINK_CLICKS">Link Clicks</option>
<option value="OFFSITE_CONVERSIONS">Offsite Conversions</option>
<option value="PAGE_LIKES">Page Likes</option>
<option value="POST_ENGAGEMENT">Post Engagement</option>
<option value="REACH">Reach</option>
<option value="LANDING_PAGE_VIEWS">Landing Page Views</option>
<option value="VALUE">Value</option>
<option value="THRUPLAY">ThruPlay</option>
<option value="SOCIAL_IMPRESSIONS">Social Impressions</option> */
}

const OPTIMISATION_GOALS = [
  { name: "None", uid: "" },
  { name: "App Installs", uid: "APP_INSTALLS" },
  { name: "Ad Recall Lift", uid: "AD_RECALL_LIFT" },
  { name: "Engaged Users", uid: "ENGAGED_USERS" },
  { name: "Event Responses", uid: "EVENT_RESPONSES" },
  { name: "Impressions", uid: "IMPRESSIONS" },
  { name: "Lead Generation", uid: "LEAD_GENERATION" },
  { name: "Link Clicks", uid: "LINK_CLICKS" },
  { name: "Offsite Conversions", uid: "OFFSITE_CONVERSIONS" },
  { name: "Page Likes", uid: "PAGE_LIKES" },
  { name: "Post Engagement", uid: "POST_ENGAGEMENT" },
  { name: "Reach", uid: "REACH" },
  { name: "Landing Page Views", uid: "LANDING_PAGE_VIEWS" },
  { name: "Value", uid: "VALUE" },
  { name: "ThruPlay", uid: "THRUPLAY" },
  { name: "Social Impressions", uid: "SOCIAL_IMPRESSIONS" },
];

const conditionalData = {
  OUTCOME_APP_PROMOTION: {
    billingEvent: [{ name: "Impressions", uid: "IMPRESSIONS" }],
    optimisationGoals: [
      { name: "App Installs", uid: "APP_INSTALLS" },
      { name: "Impressions", uid: "IMPRESSIONS" },
      { name: "Link Clicks", uid: "LINK_CLICKS" },
      { name: "Reach", uid: "REACH" },
      {
        name: "App Installs and Offsite Conversions",
        uid: "APP_INSTALLS_AND_OFFSITE_CONVERSIONS",
      },
    ],
    promotedObject: {
      application_id: "645064660474863",
      object_store_url: "http://www.facebook.com/gaming/play/645064660474863/",
    },
  },
  OUTCOME_LEADS: {
    billingEvent: [{ name: "Impressions", uid: "IMPRESSIONS" }],
    optimisationGoals: [
      { name: "Impressions", uid: "IMPRESSIONS" },
      { name: "Link Clicks", uid: "LINK_CLICKS" },
      { name: "Reach", uid: "REACH" },
      { name: "Lead Generation", uid: "LEAD_GENERATION" },
      { name: "Landing Page Views", uid: "LANDING_PAGE_VIEWS" },
    ],
    promotedObject: {
      application_id: "645064660474863",
      object_store_url: "http://www.facebook.com/gaming/play/645064660474863/",
    },
  },
  OUTCOME_SALES: {
    billingEvent: [{ name: "Impressions", uid: "IMPRESSIONS" }],
    optimisationGoals: [
      { name: "Impressions", uid: "IMPRESSIONS" },
      { name: "Link Clicks", uid: "LINK_CLICKS" },
      { name: "Reach", uid: "REACH" },
      { name: "Landing Page Views", uid: "LANDING_PAGE_VIEWS" },
      { name: "Offsite Conversions", uid: "OFFSITE_CONVERSIONS" },
      { name: "Conversations", uid: "CONVERSATIONS" },
    ],
    promotedObject: {
      product_catalog_id: "",
    },
  },
};

const getOptimisationGoalList = (objective: string) => {
  switch (objective) {
    case "OUTCOME_APP_PROMOTION":
      return [
        { name: "App Installs", uid: "APP_INSTALLS" },
        { name: "Impressions", uid: "IMPRESSIONS" },
      ];
    case "LINK_CLICKS":
      return [
        { name: "Link Clicks", uid: "LINK_CLICKS" },
        { name: "Impressions", uid: "IMPRESSIONS" },
      ];
    default:
      return [{ name: "Impressions", uid: "IMPRESSIONS" }];
  }
};

const getBillingEventList = (optimizationGoal: string) => {
  // switch (optimizationGoal) {
  //   case "THRUPLAY":
  //     return [
  //       { name: "Thruplay", uid: "THRUPLAY" },
  //       { name: "Impressions", uid: "IMPRESSIONS" },
  //     ];
  //   case "LINK_CLICKS":
  //     return [
  //       { name: "Link Clicks", uid: "LINK_CLICKS" },
  //       { name: "Impressions", uid: "IMPRESSIONS" },
  //     ];
  //   default:
  return [{ name: "Impressions", uid: "IMPRESSIONS" }];
  // }
};

const CUSTOM_AUDIENCES = [
  { name: "Website Audience", uid: "website_audience" },
  { name: "Audience", uid: "audience" },
];

const ZIP_CODES = [
  { uid: "10001", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10002", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10003", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10004", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10005", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10006", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10007", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10008", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10009", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10010", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10011", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10012", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10013", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10014", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10015", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10016", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10017", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10018", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10019", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10020", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10021", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10022", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10023", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10024", name: "UA Ukraine 123 Chernyakhiv" },
];

const BID_STRATEGIES = [
  { name: "Lowest Cost without Cap", uid: "LOWEST_COST_WITHOUT_CAP" },
  { name: "Lowest Cost with Bid Cap", uid: "LOWEST_COST_WITH_BID_CAP" },
  { name: "Cost Cap", uid: "COST_CAP" },
];

type CreateAdsetFormValues = Omit<
  ICreateAdset,
  "targeting" | "promoted_object" | "start_time" | "end_time"
> & {
  countries: any[];
  zip_codes: any;
  demographics: any;
  start_time: Dayjs;
  end_time: Dayjs;
  product_catalog_id: string;
};

const validationSchema = object({
  name: string().required("Adset Name is required"),
  daily_budget: number().required("Daily Budget is required"),
  billing_event: string().required("Billing Event is required"),
  optimization_goal: string().required("Optimization Goal is required"),
  bid_strategy: string().required("Bid Strategy is required"),
  bid_amount: number(),
  product_catalog_id: string(),
  status: string().required("Status is required"),
  start_time: string().required("Start Time is required"),
  end_time: string().required("End Time is required"),
  countries: mixed(),
  campaign_id: string().required("Campaign ID is required"),
  zip_codes: mixed(),
  demographics: mixed(),
});

export default function CreateAdset() {
  const resolver = useYupValidationResolver(validationSchema);
  const { handleSubmit, formState, register, setValue, watch } =
    useForm<CreateAdsetFormValues>({
      resolver,
    });
  const { data: campaigns, isLoading: isCampaignsFetching } = useGetCampaigns();

  const {
    mutate: postCreateAdset,
    isPending: isCreating,
    isSuccess,
  } = useCreateAdset();

  const { setCreateState } = useCampaignStore();

  const campaignValue = watch("campaign_id");
  const optimisationValue = watch("optimization_goal");
  const billingEventValue = watch("billing_event");
  const countryValue = watch("countries");
  const zipCodeValue = watch("zip_codes");
  const demographicsValue = watch("demographics");
  const statusValue = watch("status");
  const startTimeValue = watch("start_time");
  const endTimeValue = watch("end_time");
  const bidStrategyValue = watch("bid_strategy");

  useEffect(() => {
    setValue("status", "ACTIVE");
  }, [setValue]);

  function formDemographics() {
    const output =
      demographicsValue?.reduce(
        (acc: any, curr: any) => {
          if (curr.type === "interests") {
            acc[0].interests.push({ id: curr.id, name: curr.name });
          } else if (curr.type === "behaviors") {
            acc[0].behaviors.push({ id: curr.id, name: curr.name });
          } else if (curr.type === "work_employers") {
            acc[0].work_employers.push({ id: curr.id, name: curr.name });
          } else if (curr.type === "work_positions") {
            acc[0].work_positions.push({ id: curr.id, name: curr.name });
          }
          return acc;
        },
        [
          {
            interests: [],
            behaviors: [],
            work_employers: [],
            work_positions: [],
          },
        ]
      ) ?? [];

    return output;
  }

  function handleCreate(data: CreateAdsetFormValues) {
    console.log("data - ", data);
    const formData = omit(data, [
      "countries",
      "zip_codes",
      "demographics",
      "bid_amount",
    ]);

    let promotedObject = {};
    if (campaignObjective === "OUTCOME_SALES") {
      promotedObject = {
        product_catalog_id: data.product_catalog_id,
      };
    } else if (campaignObjective === "OUTCOME_APP_PROMOTION") {
      promotedObject = {
        application_id: "645064660474863",
        object_store_url:
          "http://www.facebook.com/gaming/play/645064660474863/",
      };
    }

    const adset: any = {
      ...formData,
      targeting: {
        device_platforms: ["mobile"],
        facebook_positions: ["feed"],
        publisher_platforms: ["facebook", "audience_network"],
        geo_locations: {
          countries: data.countries?.map((c) => c.uid) ?? [],
          location_types: ["home", "recent"],
          regions: data.zip_codes?.map((c: any) => ({ key: c.uid })) ?? [],
        },
        flexible_spec: formDemographics(),
        user_os: ["android", "ios"],
      },
      promoted_object: promotedObject,
      start_time: dayjs(data.start_time).format("YYYY-MM-DDTHH:mm:ssZ"),
      end_time: dayjs(data.end_time).format("YYYY-MM-DDTHH:mm:ssZ"),
      bid_strategy: data.bid_strategy,
      daily_budget: +data.daily_budget,
    };

    if (data.bid_strategy !== "LOWEST_COST_WITHOUT_CAP") {
      adset.bid_amount = +data.bid_amount;
    }

    postCreateAdset({
      adset,
    });
  }

  useEffect(() => {
    if (isSuccess) {
      setCreateState({ tab: CampaignTab.ADSETS, open: false });
    }
  }, [isSuccess, setCreateState]);

  function handleDateChange(name: "start_time" | "end_time") {
    return (date: Dayjs, dateString: string | string[]) => {
      setValue(name, date);
    };
  }

  function handleError() {
    console.log("error - ", formState.errors);
  }

  const campaignObjective = useMemo(() => {
    return campaigns?.find((c) => c.id === campaignValue)?.objective;
  }, [campaignValue, campaigns]);

  return (
    <form
      action=""
      onSubmit={handleSubmit(handleCreate)}
      onError={handleError}
      className="flex gap-4 pb-6"
    >
      <div className="flex flex-col gap-4 flex-1">
        <Autocomplete
          inputProps={{
            classNames: {
              input: "!text-white",
              label: "!text-gray-500",
            },
          }}
          disabled={isCampaignsFetching}
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
        <Input
          classNames={{
            label: "!text-gray-500",
          }}
          label="Adset Name"
          variant="flat"
          {...register("name")}
          errorMessage={formState.errors.name?.message}
          // errorMessage={formState.errors.description?.message}
        />
        <Input
          classNames={{
            label: "!text-gray-500",
          }}
          label="Daily Budget"
          variant="flat"
          type="number"
          {...register("daily_budget")}
          errorMessage={formState.errors.daily_budget?.message}
          // errorMessage={formState.errors.description?.message}
        />
        <Autocomplete
          inputProps={{
            classNames: {
              input: "!text-white",
              label: "!text-gray-500",
            },
          }}
          label="Bid Strategy"
          placeholder={"Select Bid Strategy"}
          onSelectionChange={(key: Key) => {
            setValue("bid_strategy", key as string);
          }}
          selectedKey={bidStrategyValue}
          errorMessage={formState.errors.bid_strategy?.message}
        >
          {BID_STRATEGIES.map((bidStrategy) => (
            <AutocompleteItem
              key={bidStrategy.uid}
              textValue={bidStrategy.name}
            >
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {bidStrategy.name}
              </div>
            </AutocompleteItem>
          ))}
        </Autocomplete>
        {["LOWEST_COST_WITH_BID_CAP", "COST_CAP"].includes(
          bidStrategyValue
        ) && (
          <Input
            classNames={{
              label: "!text-gray-500",
            }}
            label="Bid Cap"
            variant="flat"
            type="number"
            {...register("bid_amount")}
            errorMessage={formState.errors.bid_amount?.message}
            // errorMessage={formState.errors.description?.message}
          />
        )}
        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <label
              htmlFor=""
              className=" ml-1 !text-gray-500 text-small block transform scale-85 origin-top-left"
            >
              Start Time
            </label>
            <DatePicker
              format={"DD/MM/YYYY hh:mm a"}
              className="!h-[40px] !w-full"
              showTime
              variant="filled"
              value={startTimeValue}
              onChange={handleDateChange("start_time")}
            />
            <Element
              type="p"
              className="text-small text-danger mt-1"
              content={formState.errors.start_time?.message}
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor=""
              className=" ml-1 !text-gray-500 text-small block transform scale-85 origin-top-left"
            >
              End Time
            </label>
            <DatePicker
              format={"DD/MM/YYYY hh:mm a"}
              className="!h-[40px] !w-full"
              showTime
              variant="filled"
              value={endTimeValue}
              onChange={handleDateChange("end_time")}
            />
            <Element
              type="p"
              className="text-small text-danger mt-1"
              content={formState.errors.end_time?.message}
            />
          </div>
        </div>
        <Autocomplete
          inputProps={{
            classNames: {
              input: "!text-white",
              label: "!text-gray-500",
            },
          }}
          label="Optimisation Goal"
          placeholder={"Select Optimisation Goal"}
          onSelectionChange={(key: Key) => {
            setValue("optimization_goal", key as string);
          }}
          selectedKey={optimisationValue}
          errorMessage={formState.errors.optimization_goal?.message}
        >
          {(
            conditionalData[campaignObjective as keyof typeof conditionalData]
              ?.optimisationGoals ?? OPTIMISATION_GOALS
          ).map((optimisationGoal) => (
            <AutocompleteItem
              key={optimisationGoal.uid}
              textValue={optimisationGoal.name}
            >
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {optimisationGoal.name}
              </div>
            </AutocompleteItem>
          ))}
        </Autocomplete>
        <Autocomplete
          inputProps={{
            classNames: {
              input: "!text-white",
              label: "!text-gray-500",
            },
          }}
          label="Billing Event"
          placeholder={"Select Billing Event"}
          onSelectionChange={(key: Key) => {
            setValue("billing_event", key as string);
          }}
          selectedKey={billingEventValue}
          errorMessage={formState.errors.billing_event?.message}
        >
          {(
            conditionalData[campaignObjective as keyof typeof conditionalData]
              ?.billingEvent ?? getBillingEventList(optimisationValue)
          ).map((billingEvent) => (
            <AutocompleteItem
              key={billingEvent.uid}
              textValue={billingEvent.name}
            >
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {billingEvent.name}
              </div>
            </AutocompleteItem>
          ))}
        </Autocomplete>
      </div>
      <div className="flex flex-col gap-4 flex-1 space-between">
        <div className="flex flex-col gap-4 flex-1">
          <Autocomplete
            inputProps={{
              classNames: {
                input: "!text-white",
                label: "!text-gray-500",
              },
            }}
            label="Custom Audience"
            placeholder={"Select Custom Audience"}
          >
            {CUSTOM_AUDIENCES.map((customAudience) => (
              <AutocompleteItem
                key={customAudience.uid}
                textValue={customAudience.name}
              >
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {customAudience.name}
                </div>
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <SelectCountries
            onChange={(value: string, option: any) => {
              setValue("countries", option);
            }}
          />
          <SelectZipCodes
            onChange={(value: string, option: any) => {
              setValue("zip_codes", option);
            }}
          />
          <SelectInterests
            onChange={(value: string, option: any) => {
              setValue("demographics", option);
            }}
          />
          {campaignObjective === "OUTCOME_SALES" && (
            <Input
              classNames={{
                label: "!text-gray-500",
              }}
              label="Product Catalog Id"
              variant="flat"
              {...register("product_catalog_id")}
              errorMessage={formState.errors.product_catalog_id?.message}
            />
          )}

          {/* <Autocomplete
            inputProps={{
              classNames: {
                input: "!text-white",
                label: "!text-gray-500",
              },
            }}
            label="Add Demographics, Interests or Behaviours"
            placeholder={"Select Demographics, Interests or Behaviours"}
            onSelectionChange={(key: Key) => {
              setValue("demographics", key as string);
            }}
            selectedKey={demographicsValue}
          >
            {ZIP_CODES.map((zipCode) => (
              <AutocompleteItem key={zipCode.uid} textValue={zipCode.name}>
                <div className="flex items-center gap-3">{zipCode.name}</div>
              </AutocompleteItem>
            ))}
          </Autocomplete> */}
        </div>
        <div className="w-full flex justify-end gap-2 text-small items-center">
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

        <Button isLoading={isCreating} type="submit" color="primary">
          <span>{isCreating ? "Creating..." : "Create Adset"}</span>
        </Button>
      </div>
    </form>
  );
}

{
  /* <Autocomplete
  inputProps={{
    classNames: {
      input: "!text-white",
      label: "!text-gray-500",
    },
  }}
  label="Zip Codes"
  placeholder={"Select Zip Code"}
  onSelectionChange={(key: Key) => {
    setValue("zip_codes", key as string);
  }}
  selectedKey={zipCodeValue}
>
  {ZIP_CODES.map((zipCode) => (
    <AutocompleteItem key={zipCode.uid} textValue={zipCode.name}>
      <div className="flex items-center gap-3">

        {zipCode.name}
      </div>
    </AutocompleteItem>
  ))}
</Autocomplete>; */
}
