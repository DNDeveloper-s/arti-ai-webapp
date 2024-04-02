"use client";
import { useUpdateUser } from "@/api/user";
import Navbar from "@/components/Settings/Navbar";
import Snackbar from "@/components/Snackbar";
import { botData, dummyUser } from "@/constants/images";
import { useUser } from "@/context/UserContext";
import { useYupValidationResolver } from "@/hooks/useYupValidationResolver";
import { Avatar, Button, Checkbox, Divider, Input } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { MdDone, MdEmail } from "react-icons/md";

import { string, object, boolean } from "yup";

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
            className="mt-2 text-xs text-primary cursor-pointer"
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
      <Snackbar />
    </main>
  );
}

{
  /* <div className="bg-slate-800 ml-20 mr-20 items-center justify-center p-8 rounded-lg mt-12">
        <div className="flex py-5 justify-between">
          <label>Receive Post Suggestions</label>
          <SwitchComponent
            checked={canReceiveSuggestions}
            onChange={setCanReceiveSuggestions}
          />
        </div>
        <div
          className={`flex py-5 justify-between ${canReceiveSuggestions ? "opacity-100" : "opacity-50"}`}
        >
          <label>Suggestion Frequency</label>
          <select
            disabled={!canReceiveSuggestions}
            id="dropdown"
            name="dropdown"
            onChange={(a) => {}}
            className="border border-coolGray-500 rounded-lg p-2 outline-0 text-white bg-slate-800"
          >
            {["Daily", "Weekly", "Monthly"].map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <center>
          <CTAButton className="py-3 mr-2 rounded-lg text-sm mt-10">
            <span>Save</span>
          </CTAButton>
        </center>
      </div> */
}
