"use client";

import { FieldPath, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { useYupValidationResolver } from "@/hooks/useYupValidationResolver";
import { useCallback, useEffect, useState } from "react";
import { Button, Divider, Input } from "@nextui-org/react";
import { MdArrowBackIos } from "react-icons/md";
import { useRouter } from "next/navigation";
import {
  SocialPageObject,
  SocialPageType,
  useRegisterBusiness,
} from "@/api/conversation";
import {
  useGetAdAccounts,
  useGetUserProviders,
  useUserPages,
} from "@/api/user";
import ConnectProviderModal from "../ArtiBot/MessageItems/Deploy/ConnectProviderModal";
import { SelectMetaPageFormControl } from "../ArtiBot/MessageItems/Deploy/SelectMetaPage";
import SelectWithAutoComplete, {
  SelectWithAutoCompleteProps,
} from "../shared/renderers/SelectWithAutoComplete";
import { SelectAdAccountFormControl } from "../ArtiBot/MessageItems/Deploy/Ad/components/SelectAdAccount";
import { Platform, useUser } from "@/context/UserContext";
import { compact, omit } from "lodash";

interface RegisterBusinessFormValues {
  name: string;
  category: string;
  position: string;
  website: string;
  location: {
    zipcode: string;
    city: string;
    locality: string;
  }[];
  details: string;
  page_id: string;
  ad_account_id: string;
}
const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  category: yup.string().required("Category is required"),
  position: yup.string().required("Position is required"),
  website: yup.string().url().optional(),
  location: yup.array().of(
    yup.object().shape({
      zipcode: yup.string().required("Zipcode is required"),
      city: yup.string().required("City is required"),
      locality: yup.string().required("Locality is required"),
    })
  ),
  details: yup.string().optional(),
});

const CATEGORY_ITEMS: SelectWithAutoCompleteProps["items"] = [
  { uid: "education", name: "Education" },
  { uid: "fitness", name: "Fitness" },
  { uid: "sports", name: "Sports" },
  { uid: "fashion", name: "Fashion" },
];

export default function RegisterBusiness() {
  const router = useRouter();
  const resolver = useYupValidationResolver(validationSchema);
  const methods = useForm<RegisterBusinessFormValues>({
    resolver,
    defaultValues: {
      name: "",
      category: "",
      position: "",
      website: "",
      location: [],
      details: "",
    },
  });
  const { state } = useUser();
  const accessToken = Platform.getPlatform(
    state.data?.facebook
  )?.userAccessToken;
  const { data: pagesData, isLoading: isPagesLoading } =
    useUserPages(accessToken);

  const { handleSubmit, watch, formState, setValue, register } = methods;

  const [selectedPageId, setSelectedPageId] = useState<string>("");

  const { data: providers } = useGetUserProviders();
  const hasNoAccount =
    (providers ?? []).filter((c) => c.provider === "facebook").length === 0;

  const { data: accounts } = useGetAdAccounts();

  const { mutate: postRegisterBusiness, isPending } = useRegisterBusiness({
    onSuccess: () => {
      router.push("/");
    },
  });

  const myRegister = useCallback(
    (name: FieldPath<RegisterBusinessFormValues>) => {
      return {
        ...register(name),
        errorMessage:
          formState.errors[name as keyof typeof formState.errors]?.message,
        disabled: isPending,
        isDisabled: isPending,
      };
    },
    [register, formState, isPending]
  );

  const registerBusiness = (data: RegisterBusinessFormValues) => {
    if (isPending) return;

    const dataToSend = omit(data, ["page_id", "ad_account_id"]);

    const providers = (
      pagesData?.map((page) => ({
        name: page.name,
        image: page.picture,
        providerId: page.id,
        providerAccessToken: page.page_access_token,
        type: SocialPageType.FACEBOOK_PAGE,
      })) ?? ([] as SocialPageObject[])
    ).find((c) => c.providerId === data.page_id);

    const accountProviders = (
      accounts?.map((account) => ({
        name: account.name,
        providerId: account.id,
        type: SocialPageType.FACEBOOK_AD_ACCOUNT,
      })) ?? ([] as SocialPageObject[])
    ).find((c) => c.providerId === data.ad_account_id);

    postRegisterBusiness({
      ...data,
      socialPages: compact([providers, accountProviders]),
    });
  };

  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  return (
    <div className="w-screen h-screen bg-secondaryBackground flex items-center justify-center">
      <div className="w-[90vw] bg-black max-w-[500px] pt-2 pb-8 p-7 h-auto max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1">
            <MdArrowBackIos
              onClick={() => router.push("/")}
              style={{ fontSize: "21px" }}
            />
          </div>
          <h1 className="text-xl font-diatype mt-3 mb-4">Register Business</h1>
          <div className="flex items-center gap-1 opacity-0 pointer-events-none">
            <MdArrowBackIos style={{ fontSize: "21px" }} />
          </div>
        </div>
        <FormProvider {...methods}>
          <form
            action=""
            onSubmit={handleSubmit(registerBusiness)}
            className="flex flex-col gap-4"
          >
            <Input
              classNames={{
                label: "!text-gray-500",
              }}
              label="Business Name"
              variant="flat"
              {...myRegister("name")}
            />
            <SelectWithAutoComplete
              plural="Categories"
              label="Category"
              items={CATEGORY_ITEMS}
              name="category"
            />
            <Input
              classNames={{
                label: "!text-gray-500",
              }}
              label="Position"
              variant="flat"
              {...myRegister("position")}
            />
            <Input
              classNames={{
                label: "!text-gray-500",
              }}
              label="Website"
              variant="flat"
              {...myRegister("website")}
            />
            <Input
              classNames={{
                label: "!text-gray-500",
              }}
              label="Details"
              variant="flat"
              {...myRegister("details")}
            />
            <Divider className="my-3" />
            {hasNoAccount ? (
              <ConnectProviderModal classNames={{ base: "w-full" }} />
            ) : (
              <>
                <SelectMetaPageFormControl />
                <SelectAdAccountFormControl />
              </>
            )}
            <Divider className="my-3" />
            <div className="w-full flex items-center gap-5">
              <Button
                className="flex-1"
                isLoading={isPending}
                type="submit"
                color="primary"
                isDisabled={isPending}
              >
                <span>Register</span>
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
