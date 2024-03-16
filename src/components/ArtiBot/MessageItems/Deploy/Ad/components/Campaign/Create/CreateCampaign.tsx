import {
  ICreateCampaign,
  useCreateCampaign,
  useGetAdAccountId,
} from "@/api/user";
import { Platform, useUser } from "@/context/UserContext";
import { useYupValidationResolver } from "@/hooks/useYupValidationResolver";
import useCampaignStore, { CampaignTab } from "@/store/campaign";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Switch,
} from "@nextui-org/react";
import { Key, useEffect } from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";

const CAMPAIGN_OBJECTIVES = [
  { name: "Engagement", uid: "OUTCOME_ENGAGEMENT" },
  { name: "Leads", uid: "OUTCOME_LEADS" },
  { name: "App Promotion", uid: "OUTCOME_APP_PROMOTION" },
];

const validationSchema = object({
  name: string().required("Campaign Name is required"),
  objective: string().required("Objective is required"),
  status: string().required("Status is required"),
});

interface CreateCampaignFormValues {
  name: string;
  objective: string;
  status: "ACTIVE" | "PAUSED";
}

export default function CreateCampaign() {
  const {
    mutate: postCreateCampaign,
    isPending,
    isSuccess,
  } = useCreateCampaign();
  const resolver = useYupValidationResolver(validationSchema);
  const { handleSubmit, register, setValue, watch } =
    useForm<CreateCampaignFormValues>({ resolver });
  const { state } = useUser();
  const accessToken = Platform.getPlatform(
    state.data?.facebook
  ).userAccessToken;
  const { data: accountId } = useGetAdAccountId(accessToken);
  const { setCreateState } = useCampaignStore();

  const objectiveValue = watch("objective");
  const statusValue = watch("status");

  function handleCreate(data: ICreateCampaign) {
    postCreateCampaign({
      campaign: data,
      accessToken,
      accountId,
    });
  }

  useEffect(() => {
    if (isSuccess) {
      setCreateState({ tab: CampaignTab.CAMPAIGNS, open: false });
    }
  }, [isSuccess, setCreateState]);

  //   function handleSubmit() {}

  return (
    <form
      action=""
      onSubmit={handleSubmit(handleCreate)}
      className="flex flex-col gap-4"
    >
      <Input
        classNames={{
          label: "!text-gray-500",
        }}
        label="Campaign Name"
        variant="flat"
        {...register("name")}
        // errorMessage={formState.errors.description?.message}
      />
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
        {CAMPAIGN_OBJECTIVES.map((objective) => (
          <AutocompleteItem key={objective.uid} textValue={objective.name}>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {objective.name}
            </div>
          </AutocompleteItem>
        ))}
      </Autocomplete>
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

      <Button
        isLoading={isPending}
        type="submit"
        color="primary"
        className="mb-2"
      >
        <span>{isPending ? "Creating..." : "Create Campaign"}</span>
      </Button>
    </form>
  );
}
