"use client";

import {
  GenericLocationObject,
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
  Checkbox,
  Input,
  Switch,
  Tooltip,
} from "@nextui-org/react";
import { DatePicker } from "antd";
import React, {
  Key,
  use,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
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
import SelectMetaPage from "../../../../SelectMetaPage";
import { SnackbarContext } from "@/context/SnackbarContext";
import {
  AutoCompleteObject,
  validateAutoCompleteValue,
} from "@/api/conversation";
import { tooltips } from "@/constants/adCampaignData/tooltips";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { Tooltip as TooltipAntd } from "antd";
import LableWithTooltip from "@/components/shared/renderers/LabelWithTooltip";

import CanvasJs from "@canvasjs/react-charts";
import { useGetEstimatedReach } from "@/api/admanager";
const CanvasJSChart = CanvasJs.CanvasJSChart;

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

interface ConditionalDataListItem<T> {
  name: string;
  uid: T;
  default?: boolean;
}

interface ConditionalData {
  [key: string]: {
    conversionLocations: ConditionalDataListItem<IAdSet["destination_type"]>[];
    billingEvent: { name: string; uid: IAdSet["billing_event"] }[];
    optimisationGoals: ConditionalDataListItem<IAdSet["optimization_goal"]>[];
    promotedObject?: IAdSet["promoted_object"];
  };
}

export const conditionalData: ConditionalData = {
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
      { name: "Lead Generation", uid: "LEAD_GENERATION", default: true },
      { name: "Landing Page Views", uid: "LANDING_PAGE_VIEWS" },
    ],
    conversionLocations: [
      { name: "Instant Form", uid: "ON_AD", default: true },
      { name: "Calls", uid: "PHONE_CALL" },
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
    // promotedObject: {
    //   product_catalog_id: "",
    // },
  },
  OUTCOME_AWARENESS: {
    conversionLocations: [],
    billingEvent: [{ name: "Impressions", uid: "IMPRESSIONS" }],
    optimisationGoals: [
      { name: "Impressions", uid: "IMPRESSIONS" },
      { name: "Link Clicks", uid: "LINK_CLICKS" },
      { name: "Reach", uid: "REACH", default: true },
      { name: "Landing Page Views", uid: "LANDING_PAGE_VIEWS" },
    ],
    // promotedObject: {
    //   product_catalog_id: "",
    // },
  },
  OUTCOME_TRAFFIC: {
    billingEvent: [{ name: "Impressions", uid: "IMPRESSIONS" }],
    optimisationGoals: [
      { name: "Impressions", uid: "IMPRESSIONS" },
      { name: "Link Clicks", uid: "LINK_CLICKS", default: true },
      { name: "Reach", uid: "REACH" },
      { name: "Landing Page Views", uid: "LANDING_PAGE_VIEWS" },
    ],
    conversionLocations: [
      { name: "Website", uid: "WEBSITE", default: true },
      { name: "App", uid: "APP" },
      { name: "Messaging Apps", uid: "MESSENGER" },
      { name: "Calls", uid: "PHONE_CALL" },
    ],
    // promotedObject: {
    //   product_catalog_id: "",
    // },
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
  { name: "All", uid: undefined, numericUid: "0" },
  { name: "Men", uid: "1", numericUid: "1" },
  { name: "Women", uid: "2", numericUid: "2" },
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

type GeoLocationData = IAdSet["targeting"]["geo_locations"];
interface PrepareGeoLocationObject extends GenericLocationObject {}
function prepareGeoLocationData(
  props?: PrepareGeoLocationObject[]
): GeoLocationData | undefined {
  const desiredData = {};
  return props?.reduce((acc: GeoLocationData, curr) => {
    if (curr.type === "country") {
      acc.countries
        ? acc.countries.push(curr.key)
        : (acc.countries = [curr.key]);
    } else if (
      (curr.type === "region" ||
        curr.type === "city" ||
        curr.type === "subcity" ||
        curr.type === "neighborhood") &&
      curr.region_id
    ) {
      const region = {
        key: curr.region_id,
        name: curr.name,
        country: curr.country_code,
      };
      acc.regions ? acc.regions.push(region) : (acc.regions = [region]);
    } else if (curr.type === "zip") {
      const zip = {
        key: curr.key,
        name: curr.name,
        primary_city_id: curr.primary_city_id,
        region_id: curr.region_id,
        country: curr.country_code,
      };
      acc.zips ? acc.zips.push(zip) : (acc.zips = [zip]);
    }
    return { ...acc, location_types: ["home", "recent"] };
  }, desiredData);
}

interface PromotedObjectWithApp {
  application_id: string;
  object_store_url: string;
  page_id?: never;
}
type PromotedObject = PromotedObjectWithApp | Record<"page_id", string>;
/**
 *
 * @throws {Error}
 * @param destinationType
 * @param values
 * @returns {PromotedObject}
 */
function preparePromotedObject(
  destinationType: IAdSet["destination_type"],
  values: CreateAdsetFormValues
): PromotedObject | null {
  if (destinationType === "APP") {
    if (!values.application_id) {
      throw new Error("Application ID is required for App Promotion");
    }
    if (!values.object_store_url) {
      throw new Error("Object Store URL is required for App Promotion");
    }
    return {
      application_id: values.application_id,
      object_store_url: values.object_store_url,
    };
  }
  if (destinationType === "MESSENGER" || destinationType === "ON_AD") {
    if (!values.page_id) {
      throw new Error("Page ID is required for Messenger or Instant Form");
    }
    return {
      page_id: values.page_id,
    };
  }

  return null;
}

function flatGeoLocationData(data: GeoLocationData) {
  const arr: any[] = [];
  arr.push(
    ...(data.countries?.map((c) => ({ country_code: c, type: "country" })) ??
      []),
    ...(data.regions?.map((c) => ({ ...c, type: "region" })) ?? []),
    ...(data.zips?.map((c) => ({ ...c, type: "zip" })) ?? [])
  );
  return arr;
}

type CreateAdsetFormValues = Omit<
  ICreateAdset,
  "targeting" | "promoted_object" | "start_time" | "end_time" | "billing_event"
> & {
  // countries: any[];
  // zip_codes: any;
  locations: any;
  demographics: any;
  start_time: Dayjs | undefined;
  end_time: Dayjs | undefined;
  application_id: string;
  object_store_url: string;
  page_id: string;

  min_age: string;
  max_age: string;
  gender: string;
  destination_type: IAdSet["destination_type"];
  platform: string;
};

const validationSchema = object({
  name: string().required("Adset Name is required"),
  daily_budget: number().required("Daily Budget is required"),
  optimization_goal: string().required("Optimization Goal is required"),
  // bid_strategy: string().required("Bid Strategy is required"),
  // bid_amount: number(),
  destination_type: string(),
  min_age: string(),
  max_age: string(),
  gender: string(),
  application_id: string(),
  object_store_url: string(),
  page_id: string(),
  status: string().required("Status is required"),
  start_time: string(),
  end_time: string(),
  // countries: mixed(),
  locations: mixed(),
  campaign_id: string().required("Campaign ID is required"),
  // zip_codes: mixed(),
  demographics: mixed(),
});

export default function CreateAdset({
  autoCompleteFields,
}: {
  autoCompleteFields?: AutoCompleteObject["ad_set"];
}) {
  const resolver = useYupValidationResolver(validationSchema);
  const methods = useForm<CreateAdsetFormValues>({
    resolver,
    defaultValues: {
      status: "PAUSED",
      gender: "0",
      min_age: "18",
      max_age: "65+",
    },
  });
  const {
    handleSubmit,
    formState,
    register: originalRegister,
    setValue,
    watch,
  } = methods;
  const { data: campaignPages, isLoading: isCampaignsFetching } =
    useGetCampaigns();

  const campaigns = useMemo(() => {
    return campaignPages?.pages.map((page) => page.data).flat() || [];
  }, [campaignPages]);

  const [startAdImmediately, setStartAdImmediately] = useState(true);

  const [, setSnackbarData] = useContext(SnackbarContext).snackBarData;

  // Ref for tracking whether it's a new campaign or continuing from editing
  const createModeRef = useRef<"create" | "continue">("create");

  const register = (name: string) => {
    return {
      ...originalRegister(name as any),
      disabled: immutableFields[name as keyof CreateAdsetFormValues],
      isDisabled: immutableFields[name as keyof CreateAdsetFormValues],
    };
  };

  const {
    data: createAdSetResponse,
    mutate: postCreateAdset,
    isPending: isCreating,
    isSuccess: isCreationSuccess,
    error: creationError,
  } = useCreateAdset();

  const {
    mutate: postUpdateAdset,
    isPending: isUpdating,
    isSuccess: isUpdationSuccess,
    error: updationError,
  } = useUpdateAdset();

  const isSuccess = isCreationSuccess || isUpdationSuccess;
  const isPending = isCreating || isUpdating;
  const error = creationError || updationError;

  const {
    selected,
    formState: storeFormState,
    setFormState,
    setSelected,
  } = useCampaignStore();

  const campaignValue = watch("campaign_id");
  const optimisationValue = watch("optimization_goal");
  // const countryValue = watch("countries");
  // const zipCodeValue = watch("zip_codes");
  const locationValue = watch("locations");
  const demographicsValue = watch("demographics");
  const statusValue = watch("status");
  const startTimeValue = watch("start_time");
  const endTimeValue = watch("end_time");
  const dailyBudgetValue = watch("daily_budget");
  const nameValue = watch("name");
  const minAgeValue = watch("min_age");
  const maxAgeValue = watch("max_age");
  const genderValue = watch("gender");
  const conversionLocationValue = watch("destination_type");

  const options = useMemo(() => {
    return {
      theme: "dark1",
      animationEnabled: true,
      title: {
        // text: "Monthly Sales - 2017"
      },
      axisX: {
        valueFormatString: "DD",
      },
      axisY: {
        gridThickness: 0,
        // title: "Sales (in USD)",
      },
      data: [
        {
          yValueFormatString: "##.##",
          xValueFormatString: "DD",
          type: "spline",
          dataPoints: [
            { x: new Date(), y: 0 },
            {
              x: new Date(new Date().setDate(new Date().getDate() + 1)),
              y: 135682777.5364,
            },
            {
              x: new Date(new Date().setDate(new Date().getDate() + 2)),
              y: 316370228.10785,
            },
            {
              x: new Date(new Date().setDate(new Date().getDate() + 3)),
              y: 354705372.88271,
            },
            {
              x: new Date(new Date().setDate(new Date().getDate() + 4)),
              y: 390539792.97843,
            },
            {
              x: new Date(new Date().setDate(new Date().getDate() + 5)),
              y: 394960519.16748,
            },
            {
              x: new Date(new Date().setDate(new Date().getDate() + 6)),
              y: 396272488.8327,
            },
            {
              x: new Date(new Date().setDate(new Date().getDate() + 7)),
              y: 396930169.77107,
            },
          ],
        },
      ],
    };
  }, []);

  const immutableFields = useMemo((): Partial<
    Record<keyof CreateAdsetFormValues, boolean>
  > => {
    if (storeFormState.mode !== "edit") return {};
    return {
      campaign_id: true,
      destination_type: true,
      page_id: true,
      application_id: true,
      object_store_url: true,
      optimization_goal: true,
    };
  }, [storeFormState.mode]);

  useEffect(() => {
    console.log("error - ", error);
  }, [error]);

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
    const formData = omit(data, [
      "countries",
      "zip_codes",
      "locations",
      "demographics",
    ]);

    let promotedObject: PromotedObject | null = null;
    try {
      promotedObject = preparePromotedObject(conversionLocationValue, data);
    } catch (e: any) {
      setSnackbarData({
        message: e.message,
        status: "error",
      });
      console.error(e);
      return;
    }
    // if (campaignObjective === "OUTCOME_SALES") {
    //   promotedObject = {
    //     product_catalog_id: data.product_catalog_id,
    //   };
    // } else if (campaignObjective === "OUTCOME_APP_PROMOTION") {
    //   promotedObject = {
    //     application_id: "683754897094286",
    //     object_store_url:
    //       "http://www.facebook.com/gaming/play/683754897094286/",
    //   };
    // }

    let existingGeoLocationData = {};

    if (storeFormState.mode === "edit" && storeFormState.open === true) {
      const formData = storeFormState.rawData as IAdSet;
      existingGeoLocationData = { ...(formData.targeting.geo_locations ?? {}) };
    }

    const formGeoLocationData = prepareGeoLocationData(data.locations);

    const adset: any = {
      ...formData,
      billing_event: "IMPRESSIONS",
      targeting: {
        // device_platforms: ["mobile"],
        // facebook_positions: ["feed"],
        // publisher_platforms: ["facebook", "audience_network", "instagram"],
        geo_locations: {
          ...existingGeoLocationData,
          // countries: data.countries?.map((c) => c.uid) ?? [],
          // location_types: ["home", "recent"],
          // regions: data.zip_codes?.map((c: any) => ({ key: c.uid })) ?? [],
          ...(formGeoLocationData ?? {}),
        },
        flexible_spec: formDemographics(),
        // user_os: ["android", "ios"],
      },
      destination_type: conversionLocationValue,
      promoted_object: promotedObject,
      bid_strategy: "LOWEST_COST_WITHOUT_CAP",
      daily_budget: +data.daily_budget,
      // publisher_platforms: ["facebook", "instagram"],
    };

    if (data.start_time) {
      adset.start_time = dayjs(data.start_time).format("YYYY-MM-DDTHH:mm:ssZ");
    }

    if (data.end_time) {
      adset.end_time = dayjs(data.end_time).format("YYYY-MM-DDTHH:mm:ssZ");
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
      setValue("optimization_goal", formData.optimization_goal);
      setValue("bid_strategy", formData.bid_strategy);
      formData.targeting.geo_locations &&
        setValue(
          "locations",
          flatGeoLocationData(formData.targeting.geo_locations)
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

  /**
   *
   * @requires {autoCompleteFields}
   */
  // Handle the AutoComplete fields
  useEffect(() => {
    if (!autoCompleteFields || storeFormState.mode === "edit") return;
    validateAutoCompleteValue(autoCompleteFields?.default_fields?.name) &&
      setValue("name", autoCompleteFields.default_fields?.name as string);
    if (autoCompleteFields?.default_fields?.daily_budget) {
      validateAutoCompleteValue(
        autoCompleteFields?.default_fields?.daily_budget
      ) &&
        !isNaN(+autoCompleteFields.default_fields?.daily_budget) &&
        setValue(
          "daily_budget",
          +autoCompleteFields.default_fields?.daily_budget
        );
    }
    const startTime = autoCompleteFields.default_fields?.start_time;
    if (startTime) {
      const startTimeInDayjs = dayjs(startTime);
      startTimeInDayjs.isValid() && setValue("start_time", startTimeInDayjs);
    }
    const endTime = autoCompleteFields.default_fields?.end_time;
    if (endTime) {
      const endTimeInDayjs = dayjs(endTime);
      const isValid =
        endTimeInDayjs.isValid() &&
        endTimeInDayjs.isAfter(dayjs()) &&
        endTimeInDayjs.isAfter(dayjs(startTime));
      isValid && setValue("end_time", endTimeInDayjs);
    }
    const genderField = autoCompleteFields.default_fields?.gender;
    if (genderField) {
      validateAutoCompleteValue(genderField, {
        oneOfArr: GENDERS.map((c) => c.numericUid),
        transformer: (value) => value.toString(),
      }) &&
        GENDERS.find((c) => c.numericUid === genderField)?.uid &&
        setValue(
          "gender",
          GENDERS.find((c) => c.numericUid === genderField)?.uid ?? ""
        );
    }
    const interests = autoCompleteFields.default_fields.fb_detailed_targeting;
    if (interests) {
      const demographicValue = interests.map((interest) => ({
        // name: interest.name,
        // id: interest.id,
        // type: "interests",
        // path: ["Interests", interest.name],
        // initial: true,
        key: interest.name,
        label: (
          <div className="flex items-center justify-between gap-3 px-1">
            <span>{interest.name}</span>
            <div className="bg-default-200 px-1 text-white rounded text-[10px]">
              <span>{interest.type}</span>
            </div>
          </div>
        ),
        value: interest.id,
        uid: interest.id,
        id: interest.id,
        name: interest.name,
        type: interest.type,
        initial: true,
      }));
      setValue("demographics", demographicValue);
    }

    const locations = autoCompleteFields.default_fields.fb_location_targeting;
    if (locations) {
      const locationValue = locations.map((location) => {
        const locationArr = compact([
          location.name,
          location.primary_city,
          location.region,
          location.country_name,
          location.country_code,
        ]);
        return {
          ...location,
          value: location.key + "-" + location.type,
          label: (
            <div className="flex items-center justify-between gap-3 px-1">
              <span>{locationArr.join(", ")}</span>
            </div>
          ),
          name: location.name,
          uid: location.key,
          id: location.key,
        };
      });
      setValue("locations", locationValue);
    }
  }, [autoCompleteFields, setValue, storeFormState.mode]);

  function handleDateChange(name: "start_time" | "end_time") {
    return (date: Dayjs, dateString: string | string[]) => {
      setValue(name, date);
    };
  }

  function handleError() {
    console.log("error - ", formState.errors);
  }

  const campaignObjective = useMemo(() => {
    const objective = campaigns?.find((c) => c.id === campaignValue)?.objective;

    if (!objective) return null;

    // Set the default optimisation goal based on the objective
    const defaultOptimisationGoal = conditionalData[
      objective as keyof typeof conditionalData
    ]?.optimisationGoals.find((c) => c.default);
    defaultOptimisationGoal &&
      setValue("optimization_goal", defaultOptimisationGoal.uid);

    // Handle the autocomplete generated file for conversion location based on the objective
    const defaultConversionLocation = conditionalData[
      objective as keyof typeof conditionalData
    ]?.conversionLocations.find((c) => c.default);
    defaultConversionLocation &&
      setValue("destination_type", defaultConversionLocation.uid);

    return objective;
  }, [campaignValue, campaigns, setValue]);

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
    <FormProvider {...methods}>
      <form
        action=""
        onSubmit={handleSubmit(handleCreate)}
        onError={handleError}
        className="flex gap-4 pb-6"
      >
        <div className="flex flex-col gap-4 flex-1">
          <Tooltip
            placement="top-end"
            showArrow={true}
            offset={20}
            content={tooltips.adset.campaign}
          >
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
          </Tooltip>
          <Tooltip
            placement="top-end"
            showArrow={true}
            offset={20}
            content={tooltips.adset.name}
          >
            <Input
              classNames={{
                label: "!text-gray-500",
              }}
              label="Adset Name"
              variant="flat"
              value={nameValue}
              {...register("name")}
              errorMessage={formState.errors.name?.message}
              endContent={
                <TooltipAntd title={tooltips.adset.name}>
                  <AiOutlineQuestionCircle className="cursor-pointer" />
                </TooltipAntd>
              }
              // errorMessage={formState.errors.description?.message}
            />
          </Tooltip>
          <Tooltip
            placement="top-end"
            showArrow={true}
            offset={20}
            content={tooltips.adset.daily_budget}
          >
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
          </Tooltip>
          <div className="w-full">
            <Checkbox
              size="md"
              isSelected={startAdImmediately}
              onValueChange={(value) => {
                setStartAdImmediately(value);
              }}
              classNames={{ label: "text-small" }}
            >
              Start the ad immediately
            </Checkbox>
          </div>
          {!startAdImmediately && (
            <div className="flex gap-3 items-start">
              <Tooltip
                placement="top-end"
                showArrow={true}
                offset={5}
                content={tooltips.adset.start_time}
              >
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
              </Tooltip>
              <Tooltip
                placement="top-end"
                showArrow={true}
                offset={5}
                content={tooltips.adset.end_time}
              >
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
              </Tooltip>
            </div>
          )}
          <div className="flex gap-3 items-start">
            <div className="flex-1">
              <Tooltip
                placement="top-end"
                showArrow={true}
                offset={20}
                content={tooltips.adset.min_age}
              >
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
              </Tooltip>
            </div>
            <div className="flex-1">
              <Tooltip
                placement="top-end"
                showArrow={true}
                offset={20}
                content={tooltips.adset.max_age}
              >
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
              </Tooltip>
            </div>
          </div>
          <Autocomplete
            inputProps={{
              classNames: {
                input: "!text-white",
                label: "!text-gray-500",
              },
            }}
            label={
              <LableWithTooltip
                content={tooltips.adset.optimization_goal}
                label="Optimisation Goal"
              />
            }
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

          {conversionLocationList && conversionLocationList.length > 0 && (
            <Autocomplete
              inputProps={{
                classNames: {
                  input: "!text-white",
                  label: "!text-gray-500",
                },
              }}
              label={
                <LableWithTooltip
                  content={tooltips.adset.conversion_location}
                  label="Conversion Location"
                />
              }
              placeholder={"Select Conversion Location"}
              onSelectionChange={(key: Key) => {
                setValue("destination_type", key as IAdSet["destination_type"]);
              }}
              selectedKey={conversionLocationValue}
              errorMessage={formState.errors.destination_type?.message}
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
            <div>
              <h2 className="text-xs text-gray-500 mb-2">
                Daily Reach Estimates
              </h2>
              <div>
                <CanvasJSChart
                  options={options}
                  containerProps={{ height: "100px" }}
                />
              </div>
            </div>
            <Tooltip
              placement="top-end"
              showArrow={true}
              offset={20}
              content={tooltips.adset.gender}
            >
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
                  <AutocompleteItem
                    key={gender.numericUid}
                    textValue={gender.name}
                  >
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {gender.name}
                    </div>
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </Tooltip>
            <SelectLocations
              value={locationValue}
              onChange={(value: string, option: any) => {
                setValue("locations", option);
              }}
            />
            <Tooltip
              placement="top-end"
              showArrow={true}
              offset={20}
              content={tooltips.adset.interests}
            >
              <SelectInterests
                value={demographicsValue}
                onChange={(value: string, option: any) => {
                  setValue("demographics", option);
                }}
              />
            </Tooltip>
            {/* {campaignObjective === "OUTCOME_SALES" && (
            <Input
              classNames={{
                label: "!text-gray-500",
              }}
              label="Product Catalog Id"
              variant="flat"
              {...register("product_catalog_id")}
              errorMessage={formState.errors.product_catalog_id?.message}
            />
          )} */}
            {conversionLocationValue === "APP" && (
              <>
                <Tooltip
                  placement="top-end"
                  showArrow={true}
                  offset={20}
                  content={tooltips.adset.application_id}
                >
                  <Input
                    classNames={{
                      label: "!text-gray-500",
                    }}
                    label="Application Id"
                    variant="flat"
                    {...register("application_id")}
                    errorMessage={formState.errors.application_id?.message}
                  />
                </Tooltip>
                <Tooltip
                  placement="top-end"
                  showArrow={true}
                  offset={20}
                  content={tooltips.adset.object_store_url}
                >
                  <Input
                    classNames={{
                      label: "!text-gray-500",
                    }}
                    label="Object Store URL"
                    variant="flat"
                    {...register("object_store_url")}
                    errorMessage={formState.errors.object_store_url?.message}
                  />
                </Tooltip>
              </>
            )}
            {["MESSENGER", "ON_AD"].includes(conversionLocationValue ?? "") && (
              <SelectMetaPage
                setPageValue={(value) => {
                  setValue("page_id", value);
                }}
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
            {storeFormState.mode === "edit" && (
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
            )}
            {storeFormState.mode === "create" && (
              <Button
                isLoading={createModeRef.current === "continue" && isPending}
                type="submit"
                color="primary"
                className="flex-1"
                onClick={() => {
                  createModeRef.current = "continue";
                }}
                isDisabled={isPending}
              >
                <span>Continue</span>
              </Button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
