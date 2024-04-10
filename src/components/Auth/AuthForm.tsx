"use client";
import React, {
  FC,
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
import { SnackbarContext, SnackbarData } from "@/context/SnackbarContext";
import { wait } from "@/helpers";
import Snackbar from "@/components/Snackbar";
import GoogleSignInButton from "@/components/Auth/GoogleSigninButton";
import Link from "next/link";
import FacebookSignInButton from "@/components/Auth/FacebookSigninButton";

interface FormFieldObject<T> {
  id: string;
  label: string;
  name: T;
  not_required?: boolean;
  type?: HTMLInputTypeAttribute;
}

type FormField<T> = FormFieldObject<T> | FormFieldObject<T>[];

interface Switch {
  label: string;
  to: string;
  handleAction?: (c: any) => void;
}

interface AuthFormProps<T = string> {
  snackBarData: SnackbarData;
  handleFormSubmit: (formValues: any, e: FormEvent) => Promise<boolean>;
  formFields: FormField<T>[];
  formHeading: string;
  submitButtonLabel: string;
  googleLabel: string;
  facebookLabel: string;
  initValues: Record<string, string>;
  successMessage: string;
  leftSwitch?: Switch;
  rightSwitch?: Switch;
  showSignInToButton?: boolean;
  showSignUpButton?: boolean;
}

const AuthForm: FC<AuthFormProps> = (props) => {
  const [snackBarData, setSnackBarData] =
    useContext(SnackbarContext).snackBarData;
  const [formValues, setFormValues] = useState<AuthFormProps["initValues"]>(
    props.initValues
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { formFields } = props;

  const isRequiredValid = (val: string) =>
    val !== null && val !== undefined && val.trim().length !== 0;

  const isFormValid = () => {
    return formFields.every((field) => {
      if (field instanceof Array) {
        return field.some(
          (_field) =>
            !_field.not_required &&
            isRequiredValid(formValues[_field.name] ?? "")
        );
      }
      return (
        field.not_required || isRequiredValid(formValues[field.name] ?? "")
      );
    });
  };
  function reset() {
    setFormValues(props.initValues);
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    // The form should be valid i.e, contains all the required fields in the appropriate format
    if (!isFormValid()) return;

    // Show something to the UI that the background process is in progress
    setIsSubmitting(true);

    const isSuccess = await props.handleFormSubmit(formValues, e, reset);

    // Adjust the UI as the progress is done
    // if(isSuccess) {
    // 	setSnackBarData({
    // 		message: props.successMessage,
    // 		status: 'success'
    // 	})
    // }
    setIsSubmitting(false);
  }

  function onInputChange(name: string, value: string) {
    setFormValues((c) => ({ ...c, [name]: value }));
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-screen max-w-[300px]">
        <div className="flex flex-col items-center justify-center">
          <Logo asLink width={50} height={50} />
          <h1 className="text-xl font-diatype mt-3 mb-4">
            {props.formHeading}
          </h1>
        </div>
        <form onSubmit={handleRegister} action="">
          {formFields.map((formField) => {
            if (formField instanceof Array) {
              return (
                <div key={formField[0]?.id ?? "new-id"} className="flex gap-4">
                  {formField.map((formField) => (
                    <div key={formField.name} className="mb-3">
                      <label className="text-sm text-secondaryText" htmlFor="">
                        {formField.label}
                        {!formField.not_required && (
                          <span className="text-red-600">*</span>
                        )}
                      </label>
                      <input
                        required={!formField.not_required}
                        type={formField?.type ?? "text"}
                        value={formValues[formField.name]}
                        onChange={(e) =>
                          onInputChange(formField.name, e.target.value)
                        }
                        className={
                          "w-full mt-1 bg-secondaryText bg-opacity-25 outline-none border-2 border-opacity-0 border-red-600 rounded-lg text-md py-2 px-3 transition-all " +
                          (false ? "border-opacity-100" : "")
                        }
                      />
                    </div>
                  ))}
                </div>
              );
            }
            return (
              <div key={formField.name} className="mb-3">
                <label className="text-sm text-secondaryText" htmlFor="">
                  {formField.label} <span className="text-red-600">*</span>
                </label>
                <input
                  required={!formField.not_required}
                  type={formField?.type ?? "text"}
                  value={formValues[formField.name]}
                  onChange={(e) =>
                    onInputChange(formField.name, e.target.value)
                  }
                  className={
                    "w-full mt-1 bg-secondaryText bg-opacity-25 outline-none border-2 border-opacity-0 border-red-600 rounded-lg text-md py-2 px-3 transition-all " +
                    (false ? "border-opacity-100" : "")
                  }
                />
              </div>
            );
          })}
          <button
            disabled={!isFormValid()}
            type="submit"
            className="disabled:opacity-10 w-full mt-6 flex items-center h-12 justify-center bg-primary outline-none border-2 border-opacity-0 border-red-600 rounded-lg text-md py-2 px-3 transition-all"
          >
            {isSubmitting ? (
              <Loader style={{ scale: 0.7 }} />
            ) : (
              <span className="ml-3">{props.submitButtonLabel}</span>
            )}
          </button>
        </form>
        {props.showSignInToButton && (
          <div className="w-full max-w-[900px] mx-auto text-xs px-3 flex justify-between items-center my-8">
            <span className="text-white text-opacity-40">
              Already have an account?{" "}
              <Link href="/auth" className="text-primary">
                Log In
              </Link>
            </span>
          </div>
        )}
        {props.showSignUpButton && (
          <div className="w-full max-w-[900px] mx-auto text-xs px-1 flex justify-between items-center my-8">
            <span className="text-white text-opacity-40">
              No account?{" "}
              <Link href="/auth/register" className="text-primary">
                Sign Up
              </Link>
            </span>
            <Link
              href={props.rightSwitch.to}
              className="text-white text-opacity-60"
            >
              {props.rightSwitch.label}
            </Link>
          </div>
        )}
        {/*{(props.leftSwitch || props.rightSwitch) && <div className="w-full max-w-[900px] mx-auto text-sm px-3 flex justify-between items-center my-8">*/}
        {/*	{props.leftSwitch?.label ? <Link href={props.leftSwitch.to} className="text-primary">{props.leftSwitch.label}</Link>: <div />}*/}

        {/*	{props.rightSwitch?.label ? <Link href={props.rightSwitch.to} className="text-white text-opacity-30">{props.rightSwitch.label}</Link>: <div />}*/}
        {/*</div>}*/}
        <div className="w-full max-w-[900px] mx-auto px-3 flex justify-center items-center my-8">
          <div className="h-0.5 mr-5 flex-1 bg-gray-800" />
          <div className="flex justify-center items-center font-light text-sm font-diatype text-white text-opacity-50">
            <span>OR</span>
          </div>
          <div className="h-0.5 ml-5 flex-1 bg-gray-800" />
        </div>
        <GoogleSignInButton label={props.googleLabel} />
        <FacebookSignInButton label={props.facebookLabel} />
      </div>
    </div>
  );
};

export default AuthForm;
