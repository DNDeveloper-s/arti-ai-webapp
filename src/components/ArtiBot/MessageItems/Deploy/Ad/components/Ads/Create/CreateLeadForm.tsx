import { useCreateLeadForm } from "@/api/conversation";
import UiModal from "@/components/shared/renderers/UiModal";
import { useYupValidationResolver } from "@/hooks/useYupValidationResolver";
import { IUserPage } from "@/interfaces/IUser";
import {
  Autocomplete,
  Input,
  Button,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { Select } from "antd";
import { useCallback, useEffect, useMemo } from "react";
import { FieldPath, useForm } from "react-hook-form";
import * as yup from "yup";

// const sampleData = {
//     "name":"Form from Postman 1",
//     "questions":[{
//         "type":"FULL_NAME",
//         "key":"full name"
//     }],
//     "privacy_policy":{
//         "url":"https://pustack.com/privacy_policy"
//     },
//     "follow_up_action_url":"https://www.google.com"
// }

enum QuestionType {
  FULL_NAME = "FULL_NAME",
  EMAIL = "EMAIL",
  PHONE = "PHONE",
}

interface CreateLeadFormValues {
  name: string;
  privacy_policy: {
    url: string;
  };
  follow_up_action_url: string;
  questions: {
    type: QuestionType;
    key: string;
  }[];
}

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  privacy_policy: yup.object().shape({
    url: yup.string().required("Privacy policy is required"),
  }),
  follow_up_action_url: yup.string().required("Follow up action is required"),
  questions: yup.array().of(
    yup.object().shape({
      type: yup
        .string()
        .oneOf(Object.values(QuestionType))
        .required("Type is required"),
      key: yup.string().required("Key is required"),
    })
  ),
});

const questions = [
  { type: QuestionType.FULL_NAME, key: "full name", label: "Full Name" },
  { type: QuestionType.EMAIL, key: "email", label: "Email" },
  { type: QuestionType.PHONE, key: "phone", label: "Phone" },
];

const options = questions.map((question) => ({
  value: question.type,
  label: question.label,
  type: question.type,
  key: question.key,
}));

function CreateLeadForm({
  page,
  handleClose,
}: {
  page: IUserPage;
  handleClose: () => void;
}) {
  const resolver = useYupValidationResolver(validationSchema);
  const { register, formState, setValue, watch, handleSubmit } =
    useForm<CreateLeadFormValues>({
      resolver,
      defaultValues: {
        name: "",
        privacy_policy: {
          url: "",
        },
        follow_up_action_url: "",
        questions: [],
      },
    });

  const {
    mutate: postCreateLeadForm,
    isPending,
    isSuccess,
  } = useCreateLeadForm();

  const questionsValue = watch("questions");

  const myRegister = useCallback(
    (
      name: FieldPath<CreateLeadFormValues>,
      errorName: keyof CreateLeadFormValues
    ) => {
      return {
        ...register(name),
        errorMessage: formState.errors[errorName]?.message,
        disabled: isPending,
        isDisabled: isPending,
      };
    },
    [register, formState.errors, isPending]
  );

  const createLeadForm = useCallback(
    (data: CreateLeadFormValues) => {
      if (isPending) return;
      const questions = data.questions.map((c) => ({
        key: c.key,
        type: c.type,
      }));
      postCreateLeadForm({
        ...data,
        questions,
        pageId: page.id,
        pageAccessToken: page.page_access_token,
      });
    },
    [page.id, page.page_access_token, postCreateLeadForm, isPending]
  );

  useEffect(() => {
    if (isSuccess) {
      handleClose();
    }
  }, [isSuccess, handleClose]);

  console.log("formState - ", formState);

  return (
    <form
      action=""
      onSubmit={handleSubmit(createLeadForm)}
      className="flex flex-col gap-4"
    >
      <Input
        classNames={{
          label: "!text-gray-500",
        }}
        label="Form Name"
        variant="flat"
        {...myRegister("name", "name")}
      />
      <label
        htmlFor=""
        className=" ml-1 !text-gray-500 text-small block transform scale-85 origin-top-left"
      >
        Questions
      </label>
      <Select
        mode="multiple"
        labelInValue
        variant="filled"
        options={options}
        placeholder="Select Questions"
        value={questionsValue as any}
        onChange={(value: string, option: any) => {
          setValue("questions", option);
        }}
      />
      <Input
        classNames={{
          label: "!text-gray-500",
        }}
        label="Follow Up Action Url"
        variant="flat"
        {...myRegister("follow_up_action_url", "follow_up_action_url")}
      />
      <Input
        classNames={{
          label: "!text-gray-500",
        }}
        label="Privacy Policy Url"
        variant="flat"
        {...myRegister("privacy_policy.url", "privacy_policy")}
      />
      <div className="w-full flex items-center gap-5">
        <Button
          className="flex-1"
          isLoading={isPending}
          type="submit"
          color="primary"
          isDisabled={isPending}
        >
          <span>Create Form</span>
        </Button>
        <Button
          className="flex-1"
          type="button"
          color="default"
          isDisabled={isPending}
        >
          <span>Cancel</span>
        </Button>
      </div>
    </form>
  );
}

interface CreateLeadFormProps {
  open: boolean;
  handleClose: () => void;
  page?: IUserPage;
}
export default function CreateLeadFormModal({
  open,
  handleClose,
  page,
}: CreateLeadFormProps) {
  return (
    <UiModal
      keepMounted={false}
      isOpen={open}
      onClose={handleClose}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      classNames={{
        wrapper: "bg-black bg-opacity-50",
        base: "!max-w-[400px] !w-[90vw]",
      }}
    >
      <ModalContent>
        <ModalHeader>Create Lead Form</ModalHeader>
        <ModalBody className="overflow-auto">
          {page ? (
            <CreateLeadForm page={page} handleClose={handleClose} />
          ) : (
            <div className="flex items-center justify-center">
              <p className="text-sm text-white opacity-40">
                Select a Meta Page to start
              </p>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </UiModal>
  );
}
