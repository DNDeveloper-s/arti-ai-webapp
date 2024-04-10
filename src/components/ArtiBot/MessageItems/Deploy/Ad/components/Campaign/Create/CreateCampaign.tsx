// Import necessary dependencies and components
import {
  ICreateCampaign,
  useCreateCampaign,
  useGetAdAccountId,
  useUpdateCampaign,
} from "@/api/user";
import { Platform, useUser } from "@/context/UserContext";
import { useYupValidationResolver } from "@/hooks/useYupValidationResolver";
import { IAdCampaign } from "@/interfaces/ISocial";
import useCampaignStore, { CampaignTab } from "@/store/campaign";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Switch,
} from "@nextui-org/react";
import { Key, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { getSubmitText } from "../../../CreateAdManagerModal";
import { useSearchParams } from "next/navigation";
import { useCurrentConversation } from "@/context/CurrentConversationContext";
import {
  AutoCompleteObject,
  validateAutoCompleteValue,
} from "@/api/conversation";

// Define constants for different campaign objectives
const CAMPAIGN_OBJECTIVES = [
  // { name: "Engagement", uid: "OUTCOME_ENGAGEMENT" },
  { name: "Awareness", uid: "OUTCOME_AWARENESS" },
  { name: "Traffic", uid: "OUTCOME_TRAFFIC" },
  { name: "Leads", uid: "OUTCOME_LEADS" },
  // { name: "App Promotion", uid: "OUTCOME_APP_PROMOTION" },
];

// Define validation schema using Yup
const validationSchema = object({
  name: string().required("Campaign Name is required"),
  objective: string().required("Objective is required"),
  status: string().required("Status is required"),
});

// Define interface for form values
interface CreateCampaignFormValues {
  name: string;
  objective: string;
  status: "ACTIVE" | "PAUSED";
}

// Define the CreateCampaign component
export default function CreateCampaign({
  autoCompleteFields,
}: {
  autoCompleteFields?: AutoCompleteObject["campaign"];
}) {
  // Custom hooks for creating and updating campaigns
  const {
    mutate: postCreateCampaign,
    isPending: isCreatePending,
    isSuccess: isCreateSuccess,
    data: createCampaignResponse,
  } = useCreateCampaign();

  const {
    mutate: postUpdateCampaign,
    isPending: isUpdatePending,
    isSuccess: isUpdateSuccess,
  } = useUpdateCampaign();

  // Determine pending and success status for either create or update
  const isPending = isCreatePending || isUpdatePending;
  const isSuccess = isCreateSuccess || isUpdateSuccess;

  // Ref for tracking whether it's a new campaign or continuing from editing
  const createModeRef = useRef<"create" | "continue">("create");

  // Hook for form validation resolver
  const resolver = useYupValidationResolver(validationSchema);
  const { handleSubmit, register, setValue, watch } =
    useForm<CreateCampaignFormValues>({ resolver });

  const { conversation } = useCurrentConversation();
  const conversationId = conversation?.id;

  // State management hooks from a campaign store
  const {
    setFormState,
    formState: storeFormState,
    setSelected,
    meta,
  } = useCampaignStore();

  // Watch form values
  const objectiveValue = watch("objective");
  const statusValue = watch("status");
  const nameValue = watch("name");

  // Function to handle campaign creation or update
  function handleCreate(data: CreateCampaignFormValues) {
    if (!conversationId) {
      console.error("No conversation id found");
      return;
    }
    storeFormState.mode === "edit" && storeFormState.open === true
      ? postUpdateCampaign({
          campaign: data,
          campaignId: storeFormState.rawData.id,
        })
      : postCreateCampaign({
          campaign: {
            ...data,
            conversation_id: conversationId,
          },
        });
  }

  // Side effect to handle changes after campaign creation or update
  useEffect(() => {
    if (isSuccess) {
      createCampaignResponse &&
        setSelected(CampaignTab.CAMPAIGNS)(
          new Set([createCampaignResponse.campaignId])
        );
      createModeRef.current === "create" &&
        setFormState({ tab: CampaignTab.CAMPAIGNS, open: false });
      createModeRef.current === "continue" &&
        setFormState({ tab: CampaignTab.ADSETS, open: true, mode: "create" });
    }
  }, [isSuccess, setFormState, createCampaignResponse, setSelected]);

  // Side effect to handle pre-filling form data when editing a campaign
  useEffect(() => {
    if (storeFormState.mode === "edit" && storeFormState.open === true) {
      const formData = storeFormState.rawData as IAdCampaign;
      if (!formData) return;
      console.log("formData - ", formData);
      setValue("name", formData.name);
      setValue("objective", formData.objective);
      setValue("status", formData.status);
    }
  }, [storeFormState, setValue]);

  // Handle the AutoComplete
  useEffect(() => {
    console.log(
      "autoCompleteFields - ",
      autoCompleteFields,
      validateAutoCompleteValue(autoCompleteFields?.name)
    );
    if (autoCompleteFields) {
      validateAutoCompleteValue(autoCompleteFields?.name) &&
        setValue("name", autoCompleteFields.name as string);
      validateAutoCompleteValue(autoCompleteFields?.objective, {
        oneOfArr: CAMPAIGN_OBJECTIVES.map((c) => c.name),
        transformer: (value) => value.toUpperCase(),
      }) &&
        setValue(
          "objective",
          autoCompleteFields.objective?.toUpperCase() as string
        );
    }
  }, [autoCompleteFields, setValue]);

  // Return JSX for the component
  return (
    <form
      action=""
      onSubmit={handleSubmit(handleCreate)}
      className="flex flex-col gap-4"
    >
      {/* Input field for campaign name */}
      <Input
        classNames={{
          label: "!text-gray-500",
        }}
        label="Campaign Name"
        variant="flat"
        value={nameValue}
        {...register("name")}
        // errorMessage={formState.errors.description?.message}
      />
      {/* Autocomplete for selecting campaign objective */}
      <Autocomplete
        inputProps={{
          classNames: {
            input: "!text-white",
            label: "!text-gray-500",
          },
        }}
        label="Social Media Page"
        placeholder={"Select Objective"}
        onSelectionChange={(key: Key) => {
          setValue("objective", key as string);
        }}
        selectedKey={objectiveValue}
      >
        {/* Autocomplete items for different campaign objectives */}
        {CAMPAIGN_OBJECTIVES.map((objective) => (
          <AutocompleteItem key={objective.uid} textValue={objective.name}>
            <div className="flex items-center gap-3">
              {/* Display objective name */}
              {objective.name}
            </div>
          </AutocompleteItem>
        ))}
      </Autocomplete>
      {/* Switch for selecting campaign status */}
      <div className="w-full flex justify-end gap-2 text-small items-center">
        <Switch
          defaultSelected
          classNames={{
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

      {/* Buttons for submitting the form */}
      <div className="w-full flex items-center justify-between gap-4 mb-2">
        {/* Button for submitting and creating campaign */}
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
            {/* Determine button text based on mode and pending status */}
            {getSubmitText(
              storeFormState,
              createModeRef.current === "create" && isPending,
              "Campaign"
            )}
          </span>
        </Button>
        {/* Button for submitting and creating adset */}
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
            <span>Save & Create Adset</span>
          </Button>
        )}
      </div>
    </form>
  );
}
