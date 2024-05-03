"use client";

import { useCreateLog } from "@/api/util";
import Logo from "@/components/Logo";
import useIsProduction from "@/hooks/useIsProduction";
import Link from "next/link";
import { useEffect } from "react";
import { IoMdSettings } from "react-icons/io";
import errorAnimJson from "@/assets/lottie/error_anim.json";
import Lottie from "lottie-react";
import Contact from "@/components/ProductPage/Contact";
import Footer from "@/components/ProductPage/Footer";
import CTAButton from "@/components/CTAButton";
import { signOut } from "next-auth/react";
import { Button } from "@nextui-org/react";

interface ErrorComponentProps {
  error: Error;
  reset: () => void;
}

function formatErrorMessage(message: string) {
  return `ClientError: - ${message ?? "Something went wrong"}`;
}

export const ErrorMasterComponent = (props: ErrorComponentProps) => {
  const isProduction = useIsProduction();
  const { mutate: postCreateLog } = useCreateLog();

  useEffect(() => {
    const logData = {
      userAgent: window.navigator.userAgent,
      origin: window.location.origin,
      error: {
        stack: props.error.stack,
        message: props.error.message,
        name: props.error.name,
      },
      href: window.location.href,
      userAgentData: window.navigator.userAgentData,
      vendorSub: navigator.vendorSub,
      vendor: navigator.vendor,
      platform: navigator.platform,
      deviceMemory: navigator.deviceMemory,
    };

    const logObject = {
      type: "error",
      data: logData,
      message: "ClientError",
      route: window.location.href,
    };
    postCreateLog(logObject);
  }, [props.error, postCreateLog]);

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="flex h-20 max-w-[1000px] mx-auto w-full px-5 justify-between items-center">
        <Logo />
        <div className="flex gap-4 items-center">
          <Link href="/artibot">
            <Button color="primary" className="rounded-md" size="sm">
              <span>Go to Dashboard</span>
            </Button>
          </Link>
          <Button
            size="sm"
            color="default"
            className="rounded-md"
            onClick={() => signOut()}
          >
            <span>Log out</span>
          </Button>
        </div>
      </div>
      <div className="w-full py-20 mx-auto flex-1 max-w-[1000px] flex flex-col gap-4 justify-center items-center">
        <div>
          <Lottie
            className={"w-48 h-48"}
            animationData={errorAnimJson}
            loop={true}
          />
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <h1 className="font-extrabold text-[50px]">Oops!</h1>
          <p className="font-medium text-[40px]">Something went wrong</p>
          <p className="text-[20px] mt-1">
            Don&apos;t worry, our team is here to help
          </p>
        </div>
      </div>
      <Footer />
      {/* <p className="text-danger text-sm font-bold">
        {!isProduction
          ? formatErrorMessage(props.error.message)
          : `ClientError: - Something went wrong! Please contact support.`}
      </p> */}
    </div>
  );
};

export default function ErrorComponent(props: ErrorComponentProps) {
  const isProduction = useIsProduction();

  return (
    <div className="flex justify-center items-center my-1">
      <p className="text-danger text-sm font-bold">
        {!isProduction
          ? formatErrorMessage(props.error.message)
          : `ClientError: - Something went wrong! Please contact support.`}
      </p>
    </div>
  );
}
