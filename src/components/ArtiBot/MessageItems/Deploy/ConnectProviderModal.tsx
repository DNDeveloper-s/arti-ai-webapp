import { useLinkAccount } from "@/api/user";
import Modal from "@/components/Modal";
import { SnackbarContext } from "@/context/SnackbarContext";
import { useUser } from "@/context/UserContext";
import { IUserAccount } from "@/interfaces/IUser";
import React, { useContext } from "react";
import FacebookLogin from "react-facebook-login";

interface ConnectProviderModalProps {}
export default function ConnectProviderModal(props: ConnectProviderModalProps) {
  const [, setSnackBarData] = useContext(SnackbarContext).snackBarData;
  const { state } = useUser();
  const { mutate: linkAccount } = useLinkAccount();

  const componentClicked = () => {
    console.log("clicked");
  };

  const responseFacebook = async (response: any) => {
    console.log(response);
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
    // setSnackBarData({
    //   message: data?.message,
    //   status: data?.ok ? "success" : "error",
    // });

    // if (data?.ok) {
    //   setFacebookAccessToken(response.accessToken);
    // }
  };

  return (
    <div>
      <FacebookLogin
        appId="645064660474863"
        fields="name,email,picture"
        onClick={componentClicked}
        callback={responseFacebook}
        returnScopes={true}
        scope="instagram_basic,instagram_manage_insights,instagram_content_publish,business_management,public_profile,ads_management,pages_show_list,pages_read_engagement,read_insights"
      />
    </div>
  );
}
