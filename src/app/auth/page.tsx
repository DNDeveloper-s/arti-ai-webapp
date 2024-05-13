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
import { useRouter } from "next/navigation";
import {
  useSendEmailVerificationRequest,
  useValidateVerificationCode,
} from "@/api/auth";
import { VerifyEmailScreen } from "./register/page";

interface FormFieldObject<T> {
  id: string;
  label: string;
  name: T;
  not_required?: boolean;
  type?: HTMLInputTypeAttribute;
}

type FormField<T> = FormFieldObject<T> | FormFieldObject<T>[];

enum AUTH_FIELD_NAME {
  "EMAIL" = "email",
  "PASSWORD" = "password",
}
const initValues = {
  email: "",
  password: "",
};

type FormValues = Record<Partial<AUTH_FIELD_NAME>, string>;

export default function Auth() {
  const [snackBarData, setSnackBarData] =
    useContext(SnackbarContext).snackBarData;
  const router = useRouter();
  const [showEmailVerification, setShowEmailVerification] = useState(false);

  const formFields: FormField<AUTH_FIELD_NAME>[] = [
    {
      id: "4",
      label: "Email",
      type: "email",
      name: AUTH_FIELD_NAME.EMAIL,
    },
    {
      id: "5",
      label: "Password",
      type: "password",
      name: AUTH_FIELD_NAME.PASSWORD,
    },
  ];

  // async function signIn(formValues: FormValues) {
  // 	const usersString = localStorage.getItem('users');
  // 	await wait(2000);
  // 	if(!usersString) return false;
  // 	try {
  // 		const users = JSON.parse(usersString);
  // 		if(!(users instanceof Array)) return false;
  // 		return users.some(c => c.email === formValues.email && c.password === formValues.password);
  // 	} catch(e) {
  // 		return false;
  // 	}
  // }

  const [sentCodeCount, setSentCodeCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  useEffect(() => {
    if (isSuccess) {
      setSentCodeCount((prev) => prev + 1);
      setShowEmailVerification(true);
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

  async function handleSignIn(_formValues: FormValues, e: FormEvent) {
    // Check for the email if it already registered or not
    // const doesExist = await isEmailAlreadyRegistered(formValues.email);
    // console.log('doesExist - ', doesExist);
    setIsSubmitting(true);
    setFormValues(_formValues);
    const res = await signIn("credentials", {
      ..._formValues,
      callbackUrl: "/",
      redirect: false,
    });

    console.log("res from line 88 - ", res);

    if (res?.error) {
      if (res.error === "not_verified") {
        setSnackBarData({
          message: "Sending the code to your email to verify...",
          status: "progress",
        });
        return mutate({
          // @ts-ignore
          email: _formValues.email,
          type: "verifyEmail",
        });
      }
      setSnackBarData({
        message: "Email/password combination is incorrect",
        status: "error",
      });
    } else {
      router.push("/");
    }
    setIsSubmitting(false);
  }

  const isLoading = isSubmitting || isPending;

  return !showEmailVerification ? (
    <AuthForm
      formFields={formFields}
      formHeading={"Sign In to Arti AI"}
      initValues={initValues}
      submitButtonLabel={"Sign In"}
      googleLabel={"Sign In with Google"}
      facebookLabel={"Sign In with Facebook"}
      handleFormSubmit={handleSignIn}
      snackBarData={snackBarData}
      successMessage={"Signed in successfully!"}
      showSignUpButton
      leftSwitch={{
        label: "Sign Up",
        to: "/auth/register",
      }}
      rightSwitch={{
        label: "Forgot Password?",
        to: "#",
      }}
      isSubmitting={isLoading}
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
