import React, { FC, ReactElement } from "react";
import { FormObject } from "@/interfaces/Iform";

type TextAreaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;
type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export type ContactFormFieldKey =
  | "full_name"
  | "email"
  | "company"
  | "budget"
  | "message";
export interface ContactFormField {
  label: string;
  name: ContactFormFieldKey;
  Input: FC<ContactInputProps> | FC<ContactTextAreaProps>;
  isRadio?: boolean;
}

export interface ContactInputProps extends InputProps {
  hasError: boolean;
}

export interface ContactTextAreaProps extends TextAreaProps {
  hasError: boolean;
}

export type ContactFormObject = FormObject<ContactFormFieldKey>;

export interface ContactData {
  formFields: ContactFormField[];
}

const formFields: ContactFormField[] = [
  {
    label: "Full Name",
    name: "full_name",
    Input: ({ hasError, ...props }: ContactInputProps) => (
      <input
        {...props}
        type="text"
        className={
          "w-full mt-1 bg-white backdrop-blur-[3px] bg-opacity-25 outline-none border-2 border-opacity-0 border-red-600 rounded-xl text-md py-2 px-3 transition-all " +
          (hasError ? "border-opacity-100" : "")
        }
      />
    ),
  },
  {
    label: "Email",
    name: "email",
    Input: ({ hasError, ...props }: ContactInputProps) => (
      <input
        {...props}
        type="email"
        className={
          "w-full mt-1 bg-white backdrop-blur-[3px] bg-opacity-25 outline-none border-2 border-opacity-0 border-red-600 rounded-xl text-md py-2 px-3 transition-all " +
          (hasError ? "border-opacity-100" : "")
        }
      />
    ),
  },
  {
    label: "Company",
    name: "company",
    Input: ({ hasError, ...props }: ContactInputProps) => (
      <input
        {...props}
        type="text"
        className={
          "w-full mt-1 bg-white backdrop-blur-[3px] bg-opacity-25 outline-none border-2 border-opacity-0 border-red-600 rounded-xl text-md py-2 px-3 transition-all " +
          (hasError ? "border-opacity-100" : "")
        }
      />
    ),
  },
  {
    label: "How much do you spend on ads per week?",
    name: "budget",
    isRadio: true,
    Input: ({ hasError, ...props }: ContactInputProps) => {
      return (
        <div
          data-testid="budget-radio-container"
          className={
            "w-full mt-1 py-2 justify-between px-3 text-sm grid grid-cols-4 items-center flex-wrap"
          }
        >
          <label
            className={"cursor-pointer flex items-center gap-1.5"}
            htmlFor="$0"
          >
            <input
              {...props}
              type={"radio"}
              id={"$0"}
              value={"$0"}
              name={"budget"}
              data-testid="$0"
            />
            <span className={"text-gray-300"}>$0</span>
          </label>
          <label
            className={"cursor-pointer flex items-center gap-1.5"}
            htmlFor="$100"
          >
            <input
              {...props}
              type={"radio"}
              id={"$100"}
              value={"$100+"}
              name={"budget"}
              data-testid="$100+"
            />
            <span className={"text-gray-300"}>$100+</span>
          </label>
          <label
            className={"cursor-pointer flex items-center gap-1.5"}
            htmlFor="$1000"
          >
            <input
              {...props}
              type={"radio"}
              id={"$1000"}
              value={"$1000+"}
              name={"budget"}
              data-testid="$1000+"
            />
            <span className={"text-gray-300"}>$1000+</span>
          </label>
          <label
            className={"cursor-pointer flex items-center gap-1.5"}
            htmlFor="$10K"
          >
            <input
              {...props}
              type={"radio"}
              id={"$10K"}
              value={"$10K+"}
              name={"budget"}
              data-testid="$10k+"
            />
            <span className={"text-gray-300"}>$10K+</span>
          </label>
        </div>
      );
      // return <input {...props} type="text" className={'w-full mt-1 bg-white backdrop-blur-[3px] bg-opacity-25 outline-none border-2 border-opacity-0 border-red-600 rounded-xl text-md py-2 px-3 transition-all ' + (hasError ? 'border-opacity-100' : '')} />
    },
  },
  {
    label: "Message",
    name: "message",
    Input: ({ hasError, ...props }: ContactTextAreaProps) => (
      <textarea
        {...props}
        className={
          "w-full mt-1 bg-white backdrop-blur-[3px] bg-opacity-25 outline-none border-2 border-opacity-0 border-red-600 rounded-xl text-md py-2 px-3 transition-all " +
          (hasError ? "border-opacity-100" : "")
        }
      />
    ),
  },
];

export const contactData = {
  formFields,
};
