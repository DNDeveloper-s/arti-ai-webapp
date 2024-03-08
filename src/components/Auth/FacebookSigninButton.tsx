import React, { FC, useState } from "react";
import { signIn } from "next-auth/react";
import Loader from "@/components/Loader";
import { FaFacebook } from "react-icons/fa";

interface FacebookSignInButtonProps {
  label?: string;
  onClick?: () => void;
}

const FacebookSignInButton: FC<FacebookSignInButtonProps> = ({
  label,
  onClick,
}) => {
  const [facebookLoading, setFacebookLoading] = useState(false);

  async function handleFacebookSignIn() {
    try {
      if (facebookLoading) return;
      setFacebookLoading(true);
      const response = await signIn("facebook", { callbackUrl: "/" });
    } catch (e) {
      console.log("e - ", e);
    }
    setFacebookLoading(false);
  }

  return (
    <button
      className="w-full flex items-center h-12 justify-center mt-1 bg-[#3b5998] outline-none border-2 border-opacity-0 border-red-600 rounded-lg text-md py-2 px-3 transition-all"
      onClick={onClick ?? handleFacebookSignIn}
    >
      {facebookLoading ? (
        <Loader />
      ) : (
        <>
          <FaFacebook />
          <span className="ml-3">{label ?? "Sign In With Facebook"}</span>
        </>
      )}
    </button>
  );
};

export default FacebookSignInButton;
