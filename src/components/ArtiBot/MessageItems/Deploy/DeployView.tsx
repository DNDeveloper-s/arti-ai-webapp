import React, { useEffect } from "react";
import { UserChoice } from "../DeployButton";
import { IAdVariant } from "@/interfaces/IArtiBot";
import useErrorNotification from "@/hooks/useErrorNotification";
import {
  useGetFacebookUserAccessToken,
  useValidateFacebookAccessToken,
} from "@/api/user";
import DeployAdLayout from "./Ad/DeployAdLayout";
import DeployPostLayout from "./Post/DeployPostLayout";
import { Platform, useUser } from "@/context/UserContext";
import ConnectProviderModal from "./ConnectProviderModal";

interface DeployViewProps {
  userChoice: UserChoice;
  variant: IAdVariant;
}

export default function DeployView(props: DeployViewProps) {
  const { userChoice, variant } = props;
  const { state, setFacebookAccessToken } = useUser();
  const { userAccessToken: accessToken } = Platform.getPlatform(
    state.data?.facebook
  );
  const {
    data: validateTokenData,
    mutate: postValidateToken,
    isError: isValidateTokenError,
    error: validateTokenError,
  } = useValidateFacebookAccessToken();

  // Validate the user access token
  // This useEffect is responsible to validate the user access token
  useEffect(() => {
    if (accessToken) {
      postValidateToken({ accessToken });
    }
  }, [accessToken, postValidateToken]);

  const componentClicked = () => {
    console.log("clicked");
  };

  if (!accessToken) return <ConnectProviderModal />;

  return userChoice === UserChoice.ad ? (
    <DeployAdLayout
      //   fetchingProviders={fetchingProviders}
      variant={variant}
      accessToken={accessToken}
    />
  ) : (
    <DeployPostLayout
      // fetchingProviders={fetchingProviders}
      variant={variant}
      accessToken={accessToken}
    />
  );
}
