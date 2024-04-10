"use client";
import React, {
  FormEvent,
  HTMLInputTypeAttribute,
  useContext,
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

  async function isEmailAlreadyRegistered(email: string) {
    const usersString = localStorage.getItem("users");
    await wait(2000);
    if (!usersString) return false;
    try {
      const users = JSON.parse(usersString);
      if (!(users instanceof Array)) return false;
      return users.some((c) => c.email === email);
    } catch (e) {
      return false;
    }
  }

  async function postNewUser(formValues: FormValues) {
    const usersString = localStorage.getItem("users");
    let users = [];
    try {
      if (usersString) {
        const _users = JSON.parse(usersString);
        if (!(_users instanceof Array)) users = [];
        else users = _users;
      }
    } catch (e) {
      users = [];
    }

    users.push(formValues);
    localStorage.setItem("users", JSON.stringify(users));
    await wait(2000);
    return true;
  }

  async function handleRegister(
    formValues: FormField<REGISTER_FIELD_NAME>[],
    e: FormEvent,
    reset
  ) {
    try {
      const response = await axios.post("/api/auth/register", {
        values: formValues,
      });

      // Check for the email if it already registered or not
      // const doesExist = await isEmailAlreadyRegistered(formValues.email);
      // console.log('doesExist - ', doesExist);
      //
      // // If it is already registered, show them the message
      // if(doesExist) {
      // 	setSnackBarData({
      // 		message: 'Email is already registered with us. Try logging in.',
      // 		status: 'error'
      // 	})
      // 	return false;
      // }
      //
      // // Else, make the call to the backend with all the form fields
      // await postNewUser(formValues);
      if (response.data.ok) reset();

      await signIn("credentials", {
        ...formValues,
        callbackUrl: "/",
        redirect: true,
      });
    } catch (e) {}

    return response.data.ok;
  }

  return (
    <AuthForm<REGISTER_FIELD_NAME>
      formFields={formFields}
      formHeading={"Sign Up to Arti AI"}
      initValues={initValues}
      submitButtonLabel={"Sign Up"}
      googleLabel={"Sign Up with Google"}
      handleFormSubmit={handleRegister}
      snackBarData={snackBarData}
      successMessage={"Registered successfully!"}
      showSignInToButton={true}
    />
  );
}
