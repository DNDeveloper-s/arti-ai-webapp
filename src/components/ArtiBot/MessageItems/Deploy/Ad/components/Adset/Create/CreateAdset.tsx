import {
  ICreateAdset,
  useCreateAdset,
  useGetCampaigns,
  useUpdateAdset,
} from "@/api/user";
import { useYupValidationResolver } from "@/hooks/useYupValidationResolver";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Switch,
} from "@nextui-org/react";
import { DatePicker } from "antd";
import { Key, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { object, string, mixed, number } from "yup";
import SelectCountries from "./SelectCountries";
import SelectZipCodes from "./SelectZipCodes";
import dayjs, { Dayjs } from "dayjs";
import Element from "@/components/shared/renderers/Element";
import useCampaignStore, { CampaignTab } from "@/store/campaign";
import SelectInterests from "./SelectInterests";
import { compact, omit } from "lodash";
import { FlexibleSpec, IAdSet } from "@/interfaces/ISocial";
import { getSubmitText } from "../../../CreateAdManagerModal";
import SelectLocations from "./SelectLocations";

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

export const conditionalData = {
  OUTCOME_APP_PROMOTION: {
    conversionLocations: [],
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
      application_id: "683754897094286",
      object_store_url: "http://www.facebook.com/gaming/play/683754897094286/",
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
    conversionLocations: [
      { name: "Instant Form", uid: "INSTANT_FORM" },
      { name: "Calls", uid: "CALLS" },
    ],
    promotedObject: {
      application_id: "683754897094286",
      object_store_url: "http://www.facebook.com/gaming/play/683754897094286/",
    },
  },
  OUTCOME_SALES: {
    conversionLocations: [],
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
  OUTCOME_AWARENESS: {
    conversionLocations: [],
    billingEvent: [{ name: "Impressions", uid: "IMPRESSIONS" }],
    optimisationGoals: [
      { name: "Impressions", uid: "IMPRESSIONS" },
      { name: "Link Clicks", uid: "LINK_CLICKS" },
      { name: "Reach", uid: "REACH" },
      { name: "Landing Page Views", uid: "LANDING_PAGE_VIEWS" },
    ],
    promotedObject: {
      product_catalog_id: "",
    },
  },
  OUTCOME_TRAFFIC: {
    billingEvent: [{ name: "Impressions", uid: "IMPRESSIONS" }],
    optimisationGoals: [
      { name: "Impressions", uid: "IMPRESSIONS" },
      { name: "Link Clicks", uid: "LINK_CLICKS" },
      { name: "Reach", uid: "REACH" },
      { name: "Landing Page Views", uid: "LANDING_PAGE_VIEWS" },
    ],
    conversionLocations: [
      { name: "Website", uid: "WEBSITE" },
      { name: "App", uid: "APP" },
      { name: "Messaging Apps", uid: "MESSAGING_APPS" },
      { name: "Calls", uid: "CALLS" },
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

const GENDERS = [
  { name: "All", uid: "all" },
  { name: "Men", uid: "men" },
  { name: "Women", uid: "women" },
];

const MIN_AGES = Array.from({ length: 48 }, (_, i: number) => ({
  uid: (i + 18).toString(),
  name: (i + 18).toString(),
}));

const MAX_AGES = Array.from({ length: 48 }, (_, i: number) => {
  let ind: number | string = i + 18;
  if (ind === 65) ind = "65+";
  return {
    uid: ind.toString(),
    name: ind.toString(),
  };
});

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

function flatDemographics(flexible_spec: FlexibleSpec) {
  const arr: any[] = [];

  for (const key in flexible_spec) {
    if (
      ["interests", "behaviors", "work_employers", "work_positions"].includes(
        key
      )
    ) {
      const arr1 = flexible_spec[key as keyof FlexibleSpec].map((c) => ({
        ...c,
        type: key,
      }));
      arr.push(...arr1);
    }
  }

  return arr;

  // function formDemographics() {
  //   const output =
  //     demographicsValue?.reduce(
  //       (acc: any, curr: any) => {
  //         if (curr.type === "interests") {
  //           acc[0].interests.push({ id: curr.id, name: curr.name });
  //         } else if (curr.type === "behaviors") {
  //           acc[0].behaviors.push({ id: curr.id, name: curr.name });
  //         } else if (curr.type === "work_employers") {
  //           acc[0].work_employers.push({ id: curr.id, name: curr.name });
  //         } else if (curr.type === "work_positions") {
  //           acc[0].work_positions.push({ id: curr.id, name: curr.name });
  //         }
  //         return acc;
  //       },
  //       [
  //         {
  //           interests: [],
  //           behaviors: [],
  //           work_employers: [],
  //           work_positions: [],
  //         },
  //       ]
  //     ) ?? [];
  //   return output;
  // }
}

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
  locations: any;
  demographics: any;
  start_time: Dayjs | undefined;
  end_time: Dayjs | undefined;
  product_catalog_id: string;

  min_age: string;
  max_age: string;
  gender: string;
  conversion_location: string;
};

const validationSchema = object({
  name: string().required("Adset Name is required"),
  daily_budget: number().required("Daily Budget is required"),
  billing_event: string().required("Billing Event is required"),
  optimization_goal: string().required("Optimization Goal is required"),
  // bid_strategy: string().required("Bid Strategy is required"),
  // bid_amount: number(),
  conversion_location: string(),
  min_age: string(),
  max_age: string(),
  gender: string(),
  product_catalog_id: string(),
  status: string().required("Status is required"),
  start_time: string(),
  end_time: string(),
  countries: mixed(),
  locations: mixed(),
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

  // Ref for tracking whether it's a new campaign or continuing from editing
  const createModeRef = useRef<"create" | "continue">("create");

  const {
    data: createAdSetResponse,
    mutate: postCreateAdset,
    isPending: isCreating,
    isSuccess: isCreationSuccess,
  } = useCreateAdset();

  const {
    mutate: postUpdateAdset,
    isPending: isUpdating,
    isSuccess: isUpdationSuccess,
  } = useUpdateAdset();

  const isSuccess = isCreationSuccess || isUpdationSuccess;
  const isPending = isCreating || isUpdating;

  const {
    selected,
    formState: storeFormState,
    setFormState,
    setSelected,
  } = useCampaignStore();

  const campaignValue = watch("campaign_id");
  const optimisationValue = watch("optimization_goal");
  const billingEventValue = watch("billing_event");
  const countryValue = watch("countries");
  const zipCodeValue = watch("zip_codes");
  const locationValue = watch("locations");
  const demographicsValue = watch("demographics");
  const statusValue = watch("status");
  const startTimeValue = watch("start_time");
  const endTimeValue = watch("end_time");
  const bidStrategyValue = watch("bid_strategy");
  const dailyBudgetValue = watch("daily_budget");
  const bidAmountValue = watch("bid_amount");
  const nameValue = watch("name");
  const minAgeValue = watch("min_age");
  const maxAgeValue = watch("max_age");
  const genderValue = watch("gender");
  const conversionLocationValue = watch("conversion_location");

  const immutableFields = useMemo(() => {
    if (storeFormState.mode !== "edit") return {};
    return {
      campaign_id: true,
    };
  }, [storeFormState.mode]);

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
    return;
    const formData = omit(data, [
      "countries",
      "zip_codes",
      "locations",
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
        application_id: "683754897094286",
        object_store_url:
          "http://www.facebook.com/gaming/play/683754897094286/",
      };
    }

    let existingGeoLocationData = {};

    if (storeFormState.mode === "edit" && storeFormState.open === true) {
      const formData = storeFormState.rawData as IAdSet;
      existingGeoLocationData = { ...formData.targeting.geo_locations };
    }

    const adset: any = {
      ...formData,
      targeting: {
        device_platforms: ["mobile"],
        facebook_positions: ["feed"],
        publisher_platforms: ["facebook", "audience_network", "instagram"],
        geo_locations: {
          ...existingGeoLocationData,
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

    storeFormState.mode === "edit" && storeFormState.open === true
      ? postUpdateAdset({ adset, adsetId: storeFormState.rawData.id })
      : postCreateAdset({ adset });
  }

  useEffect(() => {
    if (storeFormState.mode === "edit" && storeFormState.open === true) {
      const formData = storeFormState.rawData as IAdSet;
      if (!formData) return;
      console.log("formData - ", formData);
      setValue("name", formData.name);
      setValue("daily_budget", +formData.daily_budget);
      setValue("billing_event", formData.billing_event);
      setValue("optimization_goal", formData.optimization_goal);
      setValue("bid_strategy", formData.bid_strategy);
      setValue(
        "countries",
        formData.targeting.geo_locations.countries?.map((c) => ({
          key: c,
          uid: c,
          country: c,
        })) ?? []
      );
      setValue(
        "zip_codes",
        formData.targeting.geo_locations.regions?.map((c) => {
          const arr = compact([c.key, c.name, c.country]);
          return {
            ...c,
            key: arr.join(", "),
            label: arr.join(", "),
            value: arr.join(", "),
            uid: c.key,
            initial: true,
          };
        }) ?? []
      );
      formData.targeting.flexible_spec &&
        setValue(
          "demographics",
          flatDemographics(formData.targeting.flexible_spec[0]).map((c) => {
            return {
              ...c,
              key: c.name,
              label: (
                <div className="flex items-center justify-between gap-3 px-1">
                  <span>{c.name}</span>
                  <div className="bg-default-200 px-1 text-white rounded text-[10px]">
                    <span>{c.type}</span>
                  </div>
                </div>
              ),
              value: c.id,
              uid: c.id,
              id: c.id,
              name: c.name,
              type: c.type,
              initial: true,
            };
          })
        );
      formData.bid_amount && setValue("bid_amount", +formData.bid_amount);
      setValue("status", formData.status);
      formData.start_time && setValue("start_time", dayjs(formData.start_time));
      formData.end_time && setValue("end_time", dayjs(formData.end_time));
      setValue("campaign_id", formData.campaign.id);
      // setValue("product_catalog_id", formData.product_catalog_id);
    } else if (selected.campaigns !== "all" && selected.campaigns.size === 1) {
      const campaignId = Array.from(selected.campaigns)[0].toString();
      setValue("campaign_id", campaignId);
    }
  }, [storeFormState, setValue, selected]);

  useEffect(() => {
    if (isSuccess) {
      setFormState({ tab: CampaignTab.ADSETS, open: false });
    }
  }, [isSuccess, setFormState]);

  // Side effect to handle changes after campaign creation or update
  useEffect(() => {
    if (isSuccess) {
      campaignValue &&
        setSelected(CampaignTab.CAMPAIGNS)(new Set([campaignValue]));
      createAdSetResponse &&
        setSelected(CampaignTab.ADSETS)(new Set([createAdSetResponse.adsetId]));
      createModeRef.current === "create" && setFormState({ open: false });
      createModeRef.current === "continue" &&
        setFormState({ tab: CampaignTab.ADS, open: true, mode: "create" });
    }
  }, [
    isSuccess,
    setFormState,
    createAdSetResponse,
    setSelected,
    campaignValue,
  ]);

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

  useEffect(() => {
    if (endTimeValue && startTimeValue && endTimeValue < startTimeValue) {
      setValue("end_time", undefined);
    }
  }, [endTimeValue, setValue, startTimeValue]);

  const conversionLocationList = useMemo(() => {
    return conditionalData[campaignObjective as keyof typeof conditionalData]
      ?.conversionLocations;
  }, [campaignObjective]);

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
        <Input
          classNames={{
            label: "!text-gray-500",
          }}
          label="Adset Name"
          variant="flat"
          value={nameValue}
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
          value={dailyBudgetValue?.toString() ?? ""}
          {...register("daily_budget")}
          errorMessage={formState.errors.daily_budget?.message}
          // errorMessage={formState.errors.description?.message}
        />
        <div className="flex gap-3 items-start">
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
              minDate={startTimeValue}
            />
            <Element
              type="p"
              className="text-small text-danger mt-1"
              content={formState.errors.end_time?.message}
            />
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <div className="flex-1">
            <Autocomplete
              inputProps={{
                classNames: {
                  input: "!text-white",
                  label: "!text-gray-500",
                },
              }}
              label="Min Age"
              placeholder={"Select Min Age"}
              onSelectionChange={(key: Key) => {
                setValue("min_age", key as string);
              }}
              selectedKey={minAgeValue}
              errorMessage={formState.errors.min_age?.message}
            >
              {MIN_AGES.map((minAge) => (
                <AutocompleteItem key={minAge.uid} textValue={minAge.name}>
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {minAge.name}
                  </div>
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
          <div className="flex-1">
            <Autocomplete
              inputProps={{
                classNames: {
                  input: "!text-white",
                  label: "!text-gray-500",
                },
              }}
              label="Max Age"
              placeholder={"Select Max Age"}
              onSelectionChange={(key: Key) => {
                setValue("max_age", key as string);
              }}
              selectedKey={maxAgeValue}
              errorMessage={formState.errors.max_age?.message}
            >
              {MAX_AGES.map((maxAge) => (
                <AutocompleteItem key={maxAge.uid} textValue={maxAge.name}>
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {maxAge.name}
                  </div>
                </AutocompleteItem>
              ))}
            </Autocomplete>
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
        {conversionLocationList && conversionLocationList.length > 0 && (
          <Autocomplete
            inputProps={{
              classNames: {
                input: "!text-white",
                label: "!text-gray-500",
              },
            }}
            label="Conversion Location"
            placeholder={"Select Conversion Location"}
            onSelectionChange={(key: Key) => {
              setValue("conversion_location", key as string);
            }}
            selectedKey={conversionLocationValue}
            errorMessage={formState.errors.conversion_location?.message}
          >
            {conversionLocationList.map((conversationLocation) => (
              <AutocompleteItem
                key={conversationLocation.uid}
                textValue={conversationLocation.name}
              >
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {conversationLocation.name}
                </div>
              </AutocompleteItem>
            ))}
          </Autocomplete>
        )}
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
            label="Gender"
            placeholder={"Select Gender"}
            onSelectionChange={(key: Key) => {
              setValue("gender", key as string);
            }}
            selectedKey={genderValue}
            errorMessage={formState.errors.gender?.message}
          >
            {GENDERS.map((gender) => (
              <AutocompleteItem key={gender.uid} textValue={gender.name}>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {gender.name}
                </div>
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <SelectCountries
            value={countryValue}
            onChange={(value: string, option: any) => {
              setValue("countries", option);
            }}
          />
          <SelectZipCodes
            value={zipCodeValue}
            onChange={(value: string, option: any) => {
              setValue("zip_codes", option);
            }}
          />
          <SelectLocations
            value={locationValue}
            onChange={(value: string, option: any) => {
              setValue("locations", option);
            }}
          />
          <SelectInterests
            value={demographicsValue}
            onChange={(value: string, option: any) => {
              console.log("demographicsValue - ", demographicsValue);
              console.log("value - ", value);
              console.log("option - ", option);
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
        <div className="w-full flex items-center justify-between gap-4 mb-2">
          <Button
            isLoading={createModeRef.current === "create" && isPending}
            type="submit"
            color="primary"
            className="flex-1"
            onClick={() => {
              createModeRef.current = "create";
            }}
            isDisabled={isPending}
          >
            <span>
              {getSubmitText(
                storeFormState,
                createModeRef.current === "create" && isPending,
                "Adset"
              )}
            </span>
          </Button>
          {storeFormState.mode === "create" && (
            <Button
              isLoading={createModeRef.current === "continue" && isPending}
              type="submit"
              color="default"
              className="flex-1"
              onClick={() => {
                createModeRef.current = "continue";
              }}
              isDisabled={isPending}
            >
              <span>Save & Create Ad</span>
            </Button>
          )}
        </div>
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

{
  /* <Autocomplete
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
    <AutocompleteItem key={bidStrategy.uid} textValue={bidStrategy.name}>
      <div className="flex items-center gap-3">{bidStrategy.name}</div>
    </AutocompleteItem>
  ))}
</Autocomplete>;
{
  ["LOWEST_COST_WITH_BID_CAP", "COST_CAP"].includes(bidStrategyValue) && (
    <Input
      classNames={{
        label: "!text-gray-500",
      }}
      label="Bid Cap"
      variant="flat"
      type="number"
      value={bidAmountValue?.toString() ?? ""}
      {...register("bid_amount")}
      errorMessage={formState.errors.bid_amount?.message}
    />
  );
} */
}
