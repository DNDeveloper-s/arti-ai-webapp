"use client";
import React, {
  FormEvent,
  HTMLInputTypeAttribute,
  useContext,
  useEffect,
  useState,
} from "react";
import Logo from "@/components/Logo";
import Image from "next/image";
import { GrGoogle } from "react-icons/gr";
import Loader from "@/components/Loader";
import { signIn } from "next-auth/react";
import { SnackbarContext } from "@/context/SnackbarContext";
import { wait } from "@/helpers";
import Snackbar from "@/components/Snackbar";
import GoogleSignInButton from "@/components/Auth/GoogleSigninButton";
import AuthForm from "@/components/Auth/AuthForm";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  useSendEmailVerificationRequest,
  useValidateVerificationCode,
} from "@/api/auth";
import Lottie from "lottie-react";
import { Button } from "@nextui-org/react";
import OtpInput from "react-otp-input";
import verifyEmailAnimation from "@/assets/lottie/verify-email.json";

interface VerifyEmailScreenProps {
  email: string | null;
  handleResendCode: () => void;
  handleChangeEmail: () => void;
  handleVerify: (code: string) => void;
  isVerifying: boolean;
  isResending: boolean;
}
export const VerifyEmailScreen = (props: VerifyEmailScreenProps) => {
  const [otp, setOtp] = useState("");
  const isOtpValid = otp.length === 6;
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <div className="w-screen max-w-[300px]">
        <div className="flex flex-col items-center justify-center">
          <Logo asLink width={50} height={50} />
          <h1 className="text-xl font-diatype mt-3 mb-4">Verify your email</h1>
        </div>
        <div className="flex items-center justify-center">
          <Lottie
            className={"w-64 h-64"}
            animationData={verifyEmailAnimation}
          />
        </div>
        <div className="text-sm text-center flex flex-col gap-1">
          <p className="text-white text-opacity-50">
            Please Enter the 6 Digit Code sent to
          </p>
          <p>{props.email}</p>
        </div>
        <div className="flex items-center justify-center my-5">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            shouldAutoFocus
            renderSeparator={<span className="opacity-0">--</span>}
            renderInput={(props) => (
              <input
                {...props}
                className="h-10 !w-10 border-b border-gray-700 focus-visible:border-primary focus-visible:outline-none"
              />
            )}
          />
        </div>
        <div>
          <Button
            className="w-full text-primary text-sm inline-block hover:underline bg-transparent"
            onClick={props.handleResendCode}
            variant="flat"
            color="primary"
            isLoading={props.isResending}
          >
            Resend Code
          </Button>
          <Button
            color="primary"
            className="w-full mt-7"
            onClick={() => props.handleVerify(otp)}
            isDisabled={!isOtpValid}
            disabled={!isOtpValid}
            isLoading={props.isVerifying}
          >
            Verify
          </Button>
          <button
            className="w-full text-primary mt-5 text-sm inline-block hover:underline"
            onClick={props.handleChangeEmail}
          >
            Change Email
          </button>
        </div>
      </div>
    </div>
  );
};

interface FormFieldObject<T> {
  id: string;
  label: string;
  name: T;
  not_required?: boolean;
  type?: HTMLInputTypeAttribute;
}

type FormField<T> = FormFieldObject<T> | FormFieldObject<T>[];

export enum REGISTER_FIELD_NAME {
  "FIRST_NAME" = "first_name",
  "LAST_NAME" = "last_name",
  "EMAIL" = "email",
  "PASSWORD" = "password",
}
const initValues = {
  email: "",
  first_name: "",
  last_name: "",
  password: "",
};

type FormValues = Record<Partial<REGISTER_FIELD_NAME>, string>;

export default function Auth() {
  const router = useRouter();
  const [snackBarData, setSnackBarData] =
    useContext(SnackbarContext).snackBarData;
  const [sentCodeCount, setSentCodeCount] = useState(0);
  const { mutate, isSuccess, isPending } = useSendEmailVerificationRequest();
  const [stepCount, setStepCount] = useState(0);
  const [formValues, setFormValues] = useState<any>(null);
  const { mutate: postValidateCode, isPending: isVerifying } =
    useValidateVerificationCode({
      onSuccess: async () => {
        try {
          setSnackBarData({
            message: "Preparing dashboard...",
            status: "progress",
          });

          const res = await signIn("credentials", {
            ...formValues,
            callbackUrl: "/business/register",
            redirect: false,
          });

          if (res?.error) {
            setSnackBarData({
              message: "Something went wrong!",
              status: "error",
            });
          } else {
            setSnackBarData(null);
            console.log("Line 107: Routing to business register");
            router.push("/business/register");
          }
        } catch (e: any) {
          setSnackBarData({
            message: e.message ?? "Something went wrong!",
            status: "error",
          });
        }
      },
      onError: (e) => {
        setSnackBarData({
          message: e.message ?? "Invalid code",
          status: "error",
        });
      },
    });

  const formFields: FormField<REGISTER_FIELD_NAME>[] = [
    [
      {
        id: "21",
        label: "First Name",
        name: REGISTER_FIELD_NAME.FIRST_NAME,
      },
      {
        id: "22",
        label: "Last Name",
        name: REGISTER_FIELD_NAME.LAST_NAME,
        not_required: true,
      },
    ],
    {
      id: "4",
      label: "Email",
      type: "email",
      name: REGISTER_FIELD_NAME.EMAIL,
    },
    {
      id: "5",
      label: "Password",
      type: "password",
      name: REGISTER_FIELD_NAME.PASSWORD,
    },
  ];

  async function sendEmailVerificationCode(
    formValues: FormField<REGISTER_FIELD_NAME>[],
    e: FormEvent,
    reset: () => void
  ) {
    try {
      setFormValues(formValues);
      await axios.post("/api/auth/register", {
        values: formValues,
      });
      mutate({
        // @ts-ignore
        email: formValues.email,
        type: "verifyEmail",
      });
    } catch (e) {
      setSnackBarData({
        message: e.message ?? "Something went wrong!",
        status: "error",
      });
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setSentCodeCount((prev) => prev + 1);
      setStepCount(1);
    }
  }, [isSuccess]);

  const handleResendCode = async () => {
    formValues.email &&
      mutate({
        email: formValues.email,
        type: "verifyEmail",
      });
  };

  const handleVerify = async (code: string) => {
    // router.push("/business/register");
    postValidateCode({ code });
  };

  return stepCount === 0 ? (
    <AuthForm<REGISTER_FIELD_NAME>
      formFields={formFields}
      formHeading={"Sign Up to Arti AI"}
      initValues={initValues}
      submitButtonLabel={"Continue"}
      googleLabel={"Sign Up with Google"}
      handleFormSubmit={sendEmailVerificationCode}
      snackBarData={snackBarData}
      successMessage={"Registered successfully!"}
      showSignInToButton={true}
      isSubmitting={isPending}
    />
  ) : (
    <VerifyEmailScreen
      key={sentCodeCount}
      email={formValues.email}
      handleResendCode={handleResendCode}
      handleChangeEmail={() => setStepCount(0)}
      handleVerify={handleVerify}
      isVerifying={isVerifying}
      isResending={isPending}
    />
  );
}
