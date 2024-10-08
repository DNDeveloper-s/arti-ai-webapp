"use client";
import React, { useContext, useMemo, useRef, useState } from "react";
import IdeaSvg from "@/assets/images/Idea.svg";
import Image from "next/image";
import axios from "axios";
import {
  contactData,
  ContactFormFieldKey,
  ContactFormObject,
} from "@/constants/contactData";
import useForm, { Validators } from "@/hooks/useForm";
import Snackbar from "@/components/Snackbar";
import { SnackbarContext } from "@/context/SnackbarContext";
import Loader from "@/components/Loader";
import { GTM_EVENT, initGTM, logEvent } from "@/utils/gtm";
import useAnalyticsClient from "@/hooks/useAnalyticsClient";

export default function Contact() {
  const { values, errors, reset, onChange } = useForm<ContactFormObject>({
    company: { value: "", validators: [Validators.isRequired] },
    email: {
      value: "",
      validators: [Validators.isRequired, Validators.isEmail],
    },
    full_name: { value: "", validators: [Validators.isRequired] },
    message: { value: "", validators: [Validators.isRequired] },
    budget: { value: "", validators: [Validators.isRequired] },
  });
  const [snackBarData, setSnackBarData] =
    useContext(SnackbarContext).snackBarData;
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const touchedRef = useRef<boolean>(false);
  const { clientId } = useAnalyticsClient();

  function isFormValid() {}

  function handleChange(key, value) {
    onChange(key, value);
    if (!touchedRef.current) {
      logEvent({
        event: GTM_EVENT.CONTACT_FORM_TOUCHED,
        event_category: "Engagement",
        event_label: "Contact Form",
        value: true,
        client_identifier: clientId,
      });
    }
    touchedRef.current = true;
  }

  async function handleSubmit() {
    setShowError(true);
    if (errors && Object.keys(errors).length > 0) return;

    logEvent({
      event: GTM_EVENT.CONTACT_FORM_SUBMISSION,
      event_category: "Engagement",
      event_label: "Contact Form",
      value: true,
      client_identifier: clientId,
    });

    setIsSubmitting(true);
    setShowError(false);

    try {
      const response = await axios.post("/api/send-mail", {
        values,
      });

      setIsSubmitting(false);
      reset();
      setSnackBarData({
        message: response.data.message,
        status: response.data.ok ? "success" : "error",
      });
    } catch (e: any) {
      console.log("e - ", e);
      setSnackBarData({
        message: e.message ?? "Something went wrong, Please try again later.",
        status: "error",
      });
    }
  }
  // <div data-groupid={"landing-section"} data-section="bg_attachment" className="w-screen h-[60vh] min-h-[500px]" style={{
  // 	backgroundImage: 'url(/assets/images/bg_image1.png)',
  // 	backgroundSize: 'cover',
  // 	backgroundAttachment: 'fixed',
  // 	backgroundPosition: 'center center'
  // }} />

  return (
    <div
      data-groupid={"landing-section"}
      data-section="contact_us"
      className="relative bg-[length:auto_100vh] md:bg-cover"
      id="contact"
      style={{
        backgroundImage: "url(/assets/images/bg_image1.png)",
        backgroundAttachment: "fixed",
        backgroundPosition: "center center",
        backgroundColor: "transparent",
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70" />
      <div className="relative text-primaryText landing-page-section !bg-transparent font-diatype">
        <div className="grid gap-10 grid-cols-1 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_500px]">
          <div className="hidden md:visible w-max-[300px] md:flex items-center">
            <Image
              className="h-[28rem]"
              src={IdeaSvg}
              alt={"Contact ArtiBot"}
            />
          </div>
          <div>
            <h3 className="landing-page-grad-title inline-block text-left pl-0">
              Join Waitlist
            </h3>
            {contactData.formFields.map((formField) => {
              return (
                <div key={formField.name} className="mb-3">
                  <label
                    className="text-sm text-secondaryText"
                    htmlFor=""
                    data-testid={formField.label}
                  >
                    {formField.label} <span className="text-red-600">*</span>
                  </label>
                  <formField.Input
                    hasError={Boolean(showError && errors[formField.name])}
                    value={values[formField.name]}
                    onChange={(e) => onChange(formField.name, e.target.value)}
                    data-testid={formField.name + "-input"}
                  />
                </div>
              );
            })}
            <button
              id={"contact-submit-id"}
              onClick={handleSubmit}
              disabled={errors && Object.keys(errors).length > 0 ? true : false}
              className="disabled:opacity-30 h-14 cta-button w-full flex items-center justify-center rounded-xl"
              data-testid={"submit-contact-button"}
            >
              {isSubmitting ? <Loader /> : <span>Submit</span>}
            </button>
          </div>
        </div>
        {snackBarData && <Snackbar />}
      </div>
    </div>
  );
}
