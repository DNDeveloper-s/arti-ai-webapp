"use client";
import { useGetCredits } from "@/api/conversation";
import {
  SubscriptionObject,
  useCancelSubscription,
  useCreatePayment,
  useGetMySubscriptions,
} from "@/api/payment";
import { useUpdateUser } from "@/api/user";
import SwitchStatus from "@/components/ArtiBot/MessageItems/Deploy/Ad/components/SwitchStatus";
import Navbar from "@/components/Settings/Navbar";
import SubscriptionPlans from "@/components/Settings/SubscriptionPlans";
import Snackbar from "@/components/Snackbar";
import UiModal from "@/components/shared/renderers/UiModal";
import UiTable from "@/components/shared/renderers/UiTable";
import { botData, dummyUser } from "@/constants/images";
import { useUser } from "@/context/UserContext";
import useMounted from "@/hooks/useMounted";
import { useYupValidationResolver } from "@/hooks/useYupValidationResolver";
import { ADMANAGER_STATUS_TYPE } from "@/interfaces/ISocial";
import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  Input,
  ModalBody,
  ModalContent,
  ModalHeader,
  Switch,
} from "@nextui-org/react";
import { Modal } from "antd";
import dayjs from "dayjs";
import {
  Key,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { MdDone, MdEmail } from "react-icons/md";

import { string, object, boolean, number } from "yup";

const valSchema = object({
  amount: number().required("Refill Amount is required"),
});

interface RefillCreditFormValues {
  amount: number;
}

function RefillCreditForm() {
  const resolver = useYupValidationResolver(valSchema);
  const { data: creditData, isFetching } = useGetCredits();
  const { handleSubmit, register, watch } = useForm<RefillCreditFormValues>({
    resolver,
  });
  const {
    mutate: postRefillCredit,
    isPending,
    isSuccess,
    data,
  } = useCreatePayment();

  const refillAmountValue = watch("amount");

  const refillCredit = (data: RefillCreditFormValues) => {
    postRefillCredit({
      amount: data.amount,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      window.open(data.url, "_self");
    }
  }, [isSuccess, data]);

  return (
    <form action="" onSubmit={handleSubmit(refillCredit)}>
      <div className="flex flex-col items-center justify-center">
        <div className="flex gap-4">
          <Input
            size="md"
            variant="bordered"
            disabled
            isDisabled
            label="Credit Balance"
            value={creditData?.balance.toString() ?? ""}
          />
          <Input
            size="md"
            variant="bordered"
            label="Amount"
            {...register("amount")}
            value={refillAmountValue?.toString() ?? ""}
          />
        </div>
        <div className="my-4 flex justify-end gap-4">
          <Button
            isLoading={isPending}
            type="submit"
            color="primary"
            size="md"
            className="text-sm"
          >
            Refill Balance
          </Button>
        </div>
      </div>
    </form>
  );
}

const columns = [
  { name: "Plan Name", uid: "name" },
  { name: "Price", uid: "price" },
  { name: "Start Date", uid: "start_date" },
  { name: "Next Renewal Date", uid: "end_date" },
  { name: "Plan Status", uid: "status" },
  { name: "Action", uid: "cancel" },
];

function SubscriptionDetails() {
  const {
    data: subscription,
    isLoading,
    fetchStatus,
  } = useGetMySubscriptions();

  const { mutate: postCancelSubscription, isPending } = useCancelSubscription();

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const subscriptions = useMemo(() => {
    return [subscription];
  }, [subscription]);

  const renderCell = useCallback(
    (subscription: SubscriptionObject, columnKey: Key): ReactNode => {
      const cellValue = Object.hasOwn(subscription, columnKey)
        ? subscription[columnKey as keyof SubscriptionObject]
        : "";

      switch (columnKey) {
        case "name":
          return (
            <div className="flex w-[100px] line-clamp-3 py-3 items-center gap-3">
              {subscription.plan_name}
            </div>
          );
        case "price":
          return (
            <div className="font-bold text-primary text-lg">
              ${subscription.amount / 100}
            </div>
          );
        case "start_date":
          return (
            <div className="flex">
              {dayjs(subscription.current_period_start).format("DD MMM YYYY")}
            </div>
          );
        case "end_date":
          return (
            <div className="flex">
              {dayjs(subscription.current_period_end).format("DD MMM YYYY")}
            </div>
          );
        case "status":
          return (
            <Switch
              color="primary"
              size="sm"
              isSelected={subscription.status === "ACTIVE"}
            ></Switch>
          );
        // case "actions":
        //   return (
        //     <div className="relative flex justify-end items-center gap-2">
        //       <Dropdown>
        //         <DropdownTrigger>
        //           <Button isIconOnly size="sm" variant="light">
        //             <FaEllipsisVertical className="text-default-300" />
        //           </Button>
        //         </DropdownTrigger>
        //         <DropdownMenu>
        //           <DropdownItem>View</DropdownItem>
        //           <DropdownItem>Edit</DropdownItem>
        //           <DropdownItem>Delete</DropdownItem>
        //         </DropdownMenu>
        //       </Dropdown>
        //     </div>
        //   );
        case "cancel":
          return (
            <Button
              variant="ghost"
              color="danger"
              isLoading={isPending}
              isDisabled={isPending}
              onClick={() => postCancelSubscription()}
            >
              Cancel
            </Button>
          );
        default:
          return cellValue;
      }
    },
    [postCancelSubscription, isPending]
  );

  return (
    <>
      <div className="mb-4">
        <h2>Subscriptions</h2>
      </div>
      <UiTable<SubscriptionObject>
        columns={columns}
        renderCell={renderCell}
        totalItems={subscriptions ?? []}
        pronoun="ad"
        // selectedKeys={selected.ads}
        // setSelectedKeys={setSelected(CampaignTab.ADS)}
        selectionMode="none"
        isLoading={isLoading}
        fetchStatus={fetchStatus}
        emptyContent={
          <div>
            <p>No subscriptions</p>
            <Button
              className="mt-2"
              size="sm"
              onClick={() => setOpen(true)}
              color="primary"
            >
              <span className="text-white">Choose Plan</span>
            </Button>
          </div>
        }
        noTopContent
        classNames={{
          wrapper: "h-[240px]",
        }}
        // hasMore={hasNextPage}
        // fetchMore={fetchNextPagnFn}
      />
      <SubscriptionPlanModal open={open} handleClose={handleClose} />
    </>
  );
}

const validationSchema = object({
  firstName: string().required("First Name is required"),
  lastName: string().required("Last Name is required"),
  //   email: string().email("Email is invalid").required("Email is required"),
  should_send_weekly_insights_email: boolean(),
});

interface SettingsFormValues {
  firstName: string;
  lastName: string;
  //   email: string;
  should_send_weekly_insights_email: boolean;
}

export default function Settings() {
  const { state } = useUser();
  const resolver = useYupValidationResolver(validationSchema);
  const { handleSubmit, register, setValue, watch } =
    useForm<SettingsFormValues>({
      resolver,
    });
  const mounted = useMounted();

  const { mutate: postUpdateUser, isPending } = useUpdateUser();
  const [fileObj, setFileObj] = useState<File | null>(null);

  const shouldValue = watch("should_send_weekly_insights_email");
  const firstNameValue = watch("firstName");
  const lastNameValue = watch("lastName");

  const saveSettings = (data: SettingsFormValues) => {
    console.log("data - ", data);
    postUpdateUser({
      imageBlob: fileObj,
      first_name: data.firstName,
      last_name: data.lastName,
      settings: {
        should_send_weekly_insights_email:
          data.should_send_weekly_insights_email,
      },
    });
  };

  const blobUrl = useMemo(() => {
    if (!fileObj) return null;
    return URL.createObjectURL(fileObj);
  }, [fileObj]);

  useEffect(() => {
    if (state.data) {
      setValue("firstName", state.data.firstName);
      setValue("lastName", state.data.lastName);
      setValue("should_send_weekly_insights_email", false);
    }
  }, [setValue, state.data]);

  return (
    <main className={"w-full max-w-[900px] mx-auto"}>
      <Navbar />
      <form
        onSubmit={handleSubmit(saveSettings)}
        className="max-w-[700px] mx-auto mt-10"
      >
        <div className="flex flex-col items-center justify-center">
          <Avatar
            classNames={{
              base: "w-24 h-24",
            }}
            src={blobUrl ?? state.data?.image ?? dummyUser.image.src}
          />
          <label
            htmlFor="change-avatar"
            className="mt-1 text-xs text-primary cursor-pointer"
          >
            <input
              type="file"
              hidden
              id="change-avatar"
              className="w-full h-full"
              onChange={(e) => {
                e.target.files && setFileObj(e.target.files[0]);
              }}
            />
            Change Avatar
          </label>
        </div>
        <Divider className="my-5" />
        <div className="flex gap-4">
          <Input
            size="md"
            variant="bordered"
            label="First Name"
            {...register("firstName")}
            value={firstNameValue}
          />
          <Input
            {...register("lastName")}
            size="md"
            variant="bordered"
            label="Last Name"
            value={lastNameValue}
          />
        </div>
        <div className="my-4">
          <Input
            value={state.data?.email ?? ""}
            isDisabled
            size="md"
            variant="bordered"
            label="Email"
            startContent={<MdEmail style={{ height: "18px" }} />}
            endContent={
              // <IoWarningOutline
              //   style={{ height: "18px" }}
              //   className="text-danger"
              // />
              <MdDone style={{ height: "18px" }} className="text-success" />
            }
          />
          {/* <span className="text-xs text-danger">
            Email not verified. Click to{" "}
            <span className="underline text-primary">Send Link</span>
          </span> */}
          {/* <span className="text-xs text-success">Email is verified</span> */}
        </div>
        <div>
          <Checkbox
            size="md"
            classNames={{ label: "text-small" }}
            checked={shouldValue}
            onValueChange={(value) => {
              setValue("should_send_weekly_insights_email", value);
            }}
          >
            Receive Weekly Insights Email
          </Checkbox>
        </div>
        <div className="my-4 flex justify-end gap-4">
          <Button color="default" size="md" className="text-sm" variant="flat">
            Discard Changes
          </Button>
          <Button
            isLoading={isPending}
            type="submit"
            color="primary"
            size="md"
            className="text-sm"
          >
            Save
          </Button>
        </div>
      </form>
      <Divider className="my-5" />
      {mounted && <SubscriptionDetails />}
      <Divider className="my-5" />
      <RefillCreditForm />
    </main>
  );
}

interface SubscriptionPlanModalProps {
  open: boolean;
  handleClose: () => void;
}
function SubscriptionPlanModal(props: SubscriptionPlanModalProps) {
  const { open, handleClose } = props;
  return (
    <UiModal
      keepMounted={false}
      isOpen={open}
      onClose={handleClose}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      classNames={{
        wrapper: "bg-black bg-opacity-50",
        base: "!max-w-[900px] !w-[90vw]",
      }}
    >
      <ModalContent>
        <ModalHeader>
          <h2>Subscription Plans</h2>
        </ModalHeader>
        <ModalBody>
          <SubscriptionPlans />
        </ModalBody>
      </ModalContent>
    </UiModal>
  );
}
