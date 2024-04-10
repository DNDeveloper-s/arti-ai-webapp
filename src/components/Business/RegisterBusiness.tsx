"use client";

import { FieldPath, useForm } from "react-hook-form";
import * as yup from "yup";
import { useYupValidationResolver } from "@/hooks/useYupValidationResolver";
import { useCallback, useEffect, useState } from "react";
import { Button, Divider, Input } from "@nextui-org/react";
import { MdArrowBackIos } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useRegisterBusiness } from "@/api/conversation";
import Snackbar from "../Snackbar";
import { useGetUserProviders } from "@/api/user";
import ConnectProviderModal from "../ArtiBot/MessageItems/Deploy/ConnectProviderModal";
import SelectMetaPage from "../ArtiBot/MessageItems/Deploy/SelectMetaPage";

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

export default function RegisterBusiness() {
  const router = useRouter();
  const resolver = useYupValidationResolver(validationSchema);
  const { handleSubmit, watch, formState, setValue, register } =
    useForm<RegisterBusinessFormValues>({
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

  const [selectedPageId, setSelectedPageId] = useState<string>("");

  const { data: providers } = useGetUserProviders();
  const hasNoAccount =
    (providers ?? []).filter((c) => c.provider === "facebook").length === 0;

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
    postRegisterBusiness(data);
  };

  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  return (
    <div className="w-screen h-screen bg-secondaryBackground flex items-center justify-center">
      <div className="w-screen bg-black max-w-[500px]">
        <div className="flex items-center justify-between">
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
          <Input
            classNames={{
              label: "!text-gray-500",
            }}
            label="Category"
            variant="flat"
            {...myRegister("category")}
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
              <SelectMetaPage setPageValue={setSelectedPageId} />
            </>
          )}
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
      </div>
    </div>
  );
}
