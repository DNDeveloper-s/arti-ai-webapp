import { useLinkAccount } from "@/api/user";
import FacebookSignInButton from "@/components/Auth/FacebookSigninButton";
import Modal from "@/components/Modal";
import { facebookScopes } from "@/config/meta";
import { SnackbarContext } from "@/context/SnackbarContext";
import { useUser } from "@/context/UserContext";
import { IUserAccount } from "@/interfaces/IUser";
import { Button } from "@nextui-org/react";
import React, { useContext } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { AiFillFacebook } from "react-icons/ai";

interface ConnectProviderModalProps {
  classNames?: {
    base?: string;
  };
}
export default function ConnectProviderModal(props: ConnectProviderModalProps) {
  const [, setSnackBarData] = useContext(SnackbarContext).snackBarData;
  const { state } = useUser();
  const { mutate: linkAccount, isPending } = useLinkAccount();

  const componentClicked = () => {
    console.log("clicked");
  };

  const responseFacebook = async (response: any) => {
    console.log("Response from facebook login", response);
    const userId = state.data?.id;
    if (!userId) {
      return setSnackBarData({
        status: "error",
        message: "Please login again!",
      });
    }

    const object: IUserAccount = {
      userId,
      type: "oauth",
      provider: "facebook",
      providerAccountId: response.id,
      access_token: response.accessToken,
      expires_at: response.data_access_expiration_time,
      token_type: "bearer",
      scope: response.grantedScopes,
      image: response.picture.data.url,
      name: response.name,
    };

    linkAccount({ account: object });
  };

  return (
    <div className={props.classNames?.base ?? ""}>
      <FacebookLogin
        appId={"683754897094286"}
        fields="name,email,picture"
        onClick={componentClicked}
        callback={responseFacebook}
        returnScopes={true}
        scope={facebookScopes}
        render={(renderProps: any) => (
          <Button
            className="w-full text-white border-2 border-blue-500 bg-blue-600"
            isLoading={isPending}
            onClick={renderProps.onClick}
            data-testid="connect-facebook-button"
          >
            <AiFillFacebook className="text-lg" />
            Connect Facebook
          </Button>
        )}
      />
    </div>
  );
}
