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

  async function handleSignIn(
    formValues: FormValues,
    e: FormEvent
  ): Promise<boolean> {
    // Check for the email if it already registered or not
    // const doesExist = await isEmailAlreadyRegistered(formValues.email);
    // console.log('doesExist - ', doesExist);
    const res = await signIn("credentials", {
      ...formValues,
      callbackUrl: "/",
      redirect: false,
    });

    if (res?.error) {
      setSnackBarData({
        message: "Email/password combination is incorrect",
        status: "error",
      });
    } else {
      router.push("/");
    }

    //
    // // If it is already registered, show them the message
    // if(!isSuccess) {
    // 	setSnackBarData({
    // 		message: 'Credentials are incorrect. Please try again!',
    // 		status: 'error'
    // 	})
    // 	return false;
    // }setSnackBarData
    // //
    // // // Else, make the call to the backend with all the form fields
    // // await postNewUser(formValues);
    // return true;
  }

  return (
    <>
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
      />
    </>
  );
}
