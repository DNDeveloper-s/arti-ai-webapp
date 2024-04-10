"use client";

import { ROUTES } from "@/config/api-config";
import axios from "axios";
import { useState, useContext } from "react";
import Snackbar from "@/components/Snackbar";
import { SnackbarContext } from "@/context/SnackbarContext";
import Link from "../../../node_modules/next/link";

export default function Email() {
  const MAILGUN_API_KEY =
    "cb3aeda539a3d1575f9c8c0bb5a8edf3 - 915161b7-d8a128be";
  const MAILGUN_DOMAIN = "error.pustack.com";
  const MAILCHIMP_API_KEY = "c52432d6515be87c12245200cf5bce4d - us18";
  const MAILCHIMP_REGION = "us18";

  const defaultValue =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Email Design</title><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0"><table align="center" border="1" cellpadding="0" cellspacing="0" width="600" background="https://www.picsum.photos/600" style=""><tr><td><img src="https://www.picsum.photos/160" alt="Creating Email Magic" width="160" height="auto" align="right" style="padding:49px 60px;display:block"><a href="facebook.com"><img src="https://www.picsum.photos/50" alt="Creating Email Magic" width="50" height="auto" align="right" style="padding:39px 0 0 0;display:block"></a><img src="https://www.picsum.photos/342" alt="Creating Email Magic" width="342" height="auto" align="left" style="padding:0 00px"></td></tr><tr><td>Row 2</td></tr><tr><td>Row 3</td></tr></table><div></div></body></html>';
  const [mailContent, onMailContentUpdate] = useState(defaultValue);
  const [templateName, setTemplateName] = useState("");
  const [snackBarData, setSnackBarData] =
    useContext(SnackbarContext).snackBarData;
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const createTemplate = async (templateName: string, mailContent: string) => {
    try {
      // Setting up the campaign data
      const data = {
        name: templateName,
        html: mailContent,
      };

      // Creating the campaign
      const response = await axios.post(ROUTES.ADS.TEMPLATES, data, {
        headers: { Authorization: `apiKey ${MAILCHIMP_API_KEY}` },
      });

      console.log(response.data);

      return { templateId: response.data.data };
    } catch (e: any) {
      return { createTemplateError: e.response.data.message };
    }
  };

  const handleCreateTemplate = async () => {
    const { templateId, createTemplateError } = await createTemplate(
      templateName,
      mailContent
    );
    if (templateId) {
      setSnackBarData({
        status: "success",
        message: "Template has been created!",
      });
      setSelectedTemplateId(templateId);
    } else {
      setSnackBarData({ status: "error", message: createTemplateError });
    }
  };

  const handleChange = (e: any) => {
    onMailContentUpdate(e.target.value);
  };
  const handleTemplateNameChange = (e: any) => {
    setTemplateName(e.target.value);
  };

  return (
    <div className="h-full p-10">
      <div className="flex flex-col items-center">
        Email Template
        <input
          onChange={handleTemplateNameChange}
          className="text-black rounded-lg p-2 mt-5"
          placeholder="Template Name"
        />
        <div className="flex mt-4">
          <textarea
            defaultValue={mailContent}
            onChange={handleChange}
            className="text-black rounded-lg p-5 mr-5 h-[300px] w-[300px]"
          ></textarea>
          <div className="bg-slate-800 rounded-lg p-5 h-[300px] w-[300px]">
            <p className="mb-4">Your Design is rendered here</p>
            <div dangerouslySetInnerHTML={{ __html: mailContent }} />
          </div>
        </div>
        <button
          onClick={handleCreateTemplate}
          className="p-4 bg-green-700 mt-4 rounded-md mb-4"
        >
          Create Template
        </button>
        {selectedTemplateId ? selectedTemplateId : <></>}
        {selectedTemplateId ? (
          <Link
            href={`/email/${selectedTemplateId}`}
            className="p-4 bg-green-700 mt-4 rounded-md mb-4"
          >
            Create Campaign
          </Link>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

const CreateCampaignComponent = () => {};
