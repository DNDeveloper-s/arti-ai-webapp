"use client";

import {
  Controller,
  FieldPath,
  FormProvider,
  useForm,
  useWatch,
} from "react-hook-form";
import * as yup from "yup";
import { useYupValidationResolver } from "@/hooks/useYupValidationResolver";
import { useCallback, useEffect, useState } from "react";
import { Button, Divider, Input, Radio, RadioGroup } from "@nextui-org/react";
import { MdArrowBackIos } from "react-icons/md";
import { useRouter } from "next/navigation";
import {
  IBusinessResponse,
  SocialPageObject,
  SocialPageType,
  useGetBusiness,
  useRegisterBusiness,
  useUpdateBusiness,
} from "@/api/conversation";
import {
  useGetAdAccounts,
  useGetUserProviders,
  useUserPages,
} from "@/api/user";
import ConnectProviderModal from "../ArtiBot/MessageItems/Deploy/ConnectProviderModal";
import {
  SelectInstagramPageFormControl,
  SelectMetaPageFormControl,
} from "../ArtiBot/MessageItems/Deploy/SelectMetaPage";
import SelectWithAutoComplete, {
  SelectWithAutoCompleteProps,
} from "../shared/renderers/SelectWithAutoComplete";
import { SelectAdAccountFormControl } from "../ArtiBot/MessageItems/Deploy/Ad/components/SelectAdAccount";
import { Platform, useUser } from "@/context/UserContext";
import { compact, omit } from "lodash";
import connectLottieJson from "@/assets/lottie/connect-account.json";
import Lottie from "lottie-react";
import { useBusiness } from "@/context/BusinessContext";

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
  instagram_page_id: string;
  ad_account_id: string;
}

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  category: yup.string(),
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

interface BusinessFormProps {
  business_id?: string;
}

export default function BusinessForm(props: BusinessFormProps) {
  const [showSecondStep, setShowSecondStep] = useState(false);
  const router = useRouter();
  const resolver = useYupValidationResolver(validationSchema);
  const methods = useForm<RegisterBusinessFormValues>({
    resolver,
  });
  const {
    facebookPages,
    instagramPages,
    isLoading: isPagesLoading,
  } = useUserPages();

  const { data: editBusinessData, isFetching } = useGetBusiness(
    props.business_id
  );
  const { setBusiness } = useBusiness();

  const { handleSubmit, watch, formState, setValue, register } = methods;

  const [selectedPageId, setSelectedPageId] = useState<string>("");

  const { data: providers, isFetching: isFetchingProviders } =
    useGetUserProviders();
  const hasNoAccount =
    !isFetchingProviders &&
    (providers ?? []).filter((c) => c.provider === "facebook").length === 0;

  const { data: accounts } = useGetAdAccounts();

  const { mutate: postRegisterBusiness, isPending: isRegisterPending } =
    useRegisterBusiness({
      onSuccess: (data: IBusinessResponse) => {
        setShowSecondStep(true);
        setBusiness(data);
        // router.push("/");
      },
    });

  const { mutate: postUpdateBusiness, isPending: isUpdatePending } =
    useUpdateBusiness({
      onSuccess: () => {
        router.push("/");
      },
    });

  const isPending = isRegisterPending || isUpdatePending;

  const isEditMode = !!props.business_id;

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

    const dataToSend = omit(data, [
      "page_id",
      "instagram_page_id",
      "ad_account_id",
    ]);

    // const facebookProvider = (
    //   facebookPages?.map((page) => ({
    //     name: page.name,
    //     image: page.picture,
    //     provider_id: page.id,
    //     provider_access_token: page.page_access_token,
    //     type: SocialPageType.FACEBOOK_PAGE,
    //   })) ?? ([] as SocialPageObject[])
    // ).find((c) => c.provider_id === data.page_id);

    // const instagramProvider = (
    //   instagramPages?.map((page) => ({
    //     name: page.name,
    //     image: page.picture,
    //     provider_id: page.id,
    //     provider_access_token: page.page_access_token,
    //     type: SocialPageType.INSTAGRAM_PAGE,
    //   })) ?? ([] as SocialPageObject[])
    // ).find((c) => c.provider_id === data.instagram_page_id);

    // const accountProviders = (
    //   accounts?.map((account) => ({
    //     name: account.name,
    //     provider_id: account.id,
    //     type: SocialPageType.FACEBOOK_AD_ACCOUNT,
    //   })) ?? ([] as SocialPageObject[])
    // ).find((c) => c.provider_id === data.ad_account_id);

    if (isEditMode && props.business_id) {
      postUpdateBusiness({
        id: props.business_id,
        ...dataToSend,
        location: [],
        // social_pages: compact([
        //   instagramProvider,
        //   facebookProvider,
        //   accountProviders,
        // ]),
      });
    } else {
      postRegisterBusiness({
        ...data,
        location: [],
        // social_pages: compact([
        //   instagramProvider,
        //   facebookProvider,
        //   accountProviders,
        // ]),
      });
    }
  };

  useEffect(() => {
    if (editBusinessData && isEditMode) {
      console.log("editBusinessData - ", editBusinessData);
      setValue("name", editBusinessData.name);
      setValue("position", editBusinessData.position);
      setValue("website", editBusinessData.website);
      setValue("details", editBusinessData.details ?? "");
      setValue("category", editBusinessData.category);
      setValue(
        "page_id",
        editBusinessData.social_pages?.find(
          (c) => c.type === SocialPageType.FACEBOOK_PAGE
        )?.provider_id ?? ""
      );
      setValue(
        "ad_account_id",
        editBusinessData.social_pages?.find(
          (c) => c.type === SocialPageType.FACEBOOK_AD_ACCOUNT
        )?.provider_id ?? ""
      );
    }
  }, [setValue, editBusinessData, isEditMode]);

  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  return (
    <div className="w-screen h-screen bg-secondaryBackground flex items-center justify-center">
      <div className="w-[90vw] bg-black max-w-[500px] pt-2 pb-8 p-7 h-auto max-h-[90vh] overflow-auto">
        {!showSecondStep ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                {isEditMode && (
                  <MdArrowBackIos
                    onClick={() => router.push("/")}
                    style={{ fontSize: "21px" }}
                  />
                )}
              </div>
              <h1 className="text-xl font-diatype mt-3 mb-4">
                {isEditMode ? "Edit" : "Register"} Business
              </h1>
              <div className="flex items-center gap-1 opacity-0 pointer-events-none">
                {isEditMode && <MdArrowBackIos style={{ fontSize: "21px" }} />}
              </div>
            </div>
            <div className="w-full mb-6">
              <p className="text-sm font-medium text-gray-400 leading-normal mb-1">
                Welcome to Arit AI!
              </p>
              <p className="text-sm text-gray-500 leading-normal">
                You&apos;re here to register your business first—essential for
                personalized tools and targeted advertising. Let&apos;s begin!
              </p>
            </div>
            <FormProvider {...methods}>
              <form
                action=""
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(registerBusiness)(e);
                }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-1 flex-shrink-0 flex-col gap-4">
                  <Controller
                    control={methods.control}
                    name="name"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Input
                        classNames={{
                          label: "!text-gray-500",
                        }}
                        label="Business Name"
                        variant="flat"
                        onChange={onChange}
                        value={value}
                        data-testid="name"
                      />
                    )}
                  />

                  <SelectWithAutoComplete
                    plural="Categories"
                    label="Category"
                    items={CATEGORY_ITEMS}
                    name="category"
                    data-testid="category"
                  />
                  <Input
                    classNames={{
                      label: "!text-gray-500",
                    }}
                    label="Position"
                    variant="flat"
                    {...myRegister("position")}
                    value={watch("position")}
                    data-testid="position"
                  />
                  <Input
                    classNames={{
                      label: "!text-gray-500",
                    }}
                    label="Website"
                    variant="flat"
                    {...myRegister("website")}
                    value={watch("website")}
                    data-testid="website"
                  />
                  {/* {!isFetchingProviders &&
                (hasNoAccount ? (
                  <>
                    <div>
                      <p className="text-tiny mb-2 text-gray-500 leading-normal">
                        Connect your social account, else you can choose to do
                        it later.
                      </p>
                      <ConnectProviderModal classNames={{ base: "w-full" }} />
                    </div>
                  </>
                ) : (
                  <>
                    <SelectAdAccountFormControl />
                  </>
                ))} */}
                  <Input
                    classNames={{
                      label: "!text-gray-500",
                    }}
                    label="More details about your business"
                    variant="flat"
                    {...myRegister("details")}
                    value={watch("details")}
                    data-testid="details"
                  />
                </div>
                <div className="flex flex-1 flex-shrink-0 flex-col gap-4">
                  {/* {!isFetchingProviders && !hasNoAccount && (
                <>
                  <SelectMetaPageFormControl />
                  <SelectInstagramPageFormControl name="instagram_page_id" />
                </>
              )} */}

                  <div className="flex-1"></div>
                  <Divider className="my-3" />
                  <div className="w-full flex items-center gap-5">
                    <Button
                      className="flex-1"
                      isLoading={isPending}
                      type="submit"
                      color="primary"
                      disabled={isPending}
                      isDisabled={isPending}
                      data-testid="submit-business-button"
                    >
                      <span>{isEditMode ? "Update" : "Register"}</span>
                    </Button>
                  </div>
                </div>
              </form>
            </FormProvider>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              {/* <div className="flex items-center gap-1">
              {isEditMode && (
                <MdArrowBackIos
                  onClick={() => router.push("/")}
                  style={{ fontSize: "21px" }}
                />
              )}
            </div> */}
              <h1 className="text-xl font-diatype mt-3 mb-4">
                Connect your Social Media Account
              </h1>
              {/* <div className="flex items-center gap-1 opacity-0 pointer-events-none">
              {isEditMode && <MdArrowBackIos style={{ fontSize: "21px" }} />}
            </div> */}
            </div>
            <div className="w-full mb-6">
              <p className="text-sm text-gray-500 leading-normal">
                Connect with Facebook now to enable personalized services. Gain
                access to ad account, Facebook page, and Instagram insights for
                targeted growth.
              </p>
            </div>
            <FormProvider {...methods}>
              <form
                action=""
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(registerBusiness)(e);
                }}
                className="flex flex-col gap-4"
              >
                {!isFetchingProviders &&
                  (hasNoAccount ? (
                    <>
                      <div className="flex flex-col gap-5 items-center justify-center">
                        <Lottie
                          className={"w-48 h-48"}
                          animationData={connectLottieJson}
                          loop={true}
                        />
                        <ConnectProviderModal classNames={{ base: "w-full" }} />
                      </div>
                    </>
                  ) : (
                    <>
                      <SelectAdAccountFormControl />
                      <SelectMetaPageFormControl />
                      <SelectInstagramPageFormControl name="instagram_page_id" />
                    </>
                  ))}
                <div className="flex flex-1 flex-shrink-0 flex-col gap-4">
                  <Divider className="my-3" />
                  <div className="w-full flex items-center gap-5">
                    {!isFetchingProviders && !hasNoAccount && (
                      <Button
                        className="flex-1"
                        isLoading={isPending}
                        type="submit"
                        color="primary"
                        disabled={isPending}
                        isDisabled={isPending}
                        data-testid="submit-business-button"
                      >
                        <span>Save</span>
                      </Button>
                    )}
                    <Button
                      className="flex-1"
                      isLoading={isPending}
                      type="button"
                      color="default"
                      disabled={isPending}
                      isDisabled={isPending}
                      data-testid="submit-business-button"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push("/");
                      }}
                    >
                      <span>Skip for now</span>
                    </Button>
                  </div>
                </div>
              </form>
            </FormProvider>
          </>
        )}
      </div>
    </div>
  );
}
