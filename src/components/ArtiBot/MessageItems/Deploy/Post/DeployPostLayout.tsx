import { SnackbarContext } from "@/context/SnackbarContext";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import CreatePostView from "./components/CreatePostView";
import axios, { AxiosError } from "axios";
import { ROUTES } from "@/config/api-config";
import { IAdVariant } from "@/interfaces/IArtiBot";
import Loader from "@/components/Loader";
import ViewFacebookPosts from "./components/View/ViewFacebookPosts";
import { MdArrowBackIos, MdEmail } from "react-icons/md";
import FacebookSignInButton from "@/components/Auth/FacebookSigninButton";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import FacebookLogin from "react-facebook-login";
import { linkAccount } from "@/context/UserContext";
import { useUser } from "@/context/UserContext";
import { IUserAccount, IUserPage } from "@/interfaces/IUser";
import { useUserPages } from "@/api/user";
import useErrorNotification from "@/hooks/useErrorNotification";

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  page_access_token: string;
}
const delay = (delay: number) =>
  new Promise((res) => {
    setTimeout(res, delay);
  });
export default function DeployPostLayout({
  accessToken,
  variant,
}: {
  accessToken: string;
  variant: IAdVariant;
}) {
  const [isLoadingPages, setLoadingPages] = useState(false);
  const [snackBarData, setSnackBarData] =
    useContext(SnackbarContext).snackBarData;
  const [showPreview, setShowPreview] = useState<boolean>(false);
  // const [pagesData, setPagesData] = useState<FacebookPage[]>([]);
  const [selectedPage, selectPage] = useState<IUserPage | null>();
  const [isInCreateMode, setIsInCreateMode] = useState<boolean>(false);
  const fetchedRef = useRef(false);
  const searchParams = useSearchParams();
  const { state } = useUser();
  const {
    data: pagesData,
    isError,
    isSuccess,
    error,
    refetch,
    isLoading,
  } = useUserPages(accessToken);

  const showConnectFacebookButton = !accessToken;

  useEffect(() => {
    if (accessToken && !fetchedRef.current) {
      refetch();
      fetchedRef.current = true;
    }
  }, [accessToken, refetch]);

  useErrorNotification({
    isError,
    error,
    fallbackMessage: "An error occurred while fetching pages!",
  });

  const onPageButtonClick = async ({ page }: { page: IUserPage }) => {
    selectPage(null);
    setIsInCreateMode(false);
    await delay(100);
    console.log("page - ", page);
    selectPage(page);
  };

  const handleActionButtonClick = async () => {
    if (selectedPage) {
      setIsInCreateMode(true);
    } else {
    }
  };

  return <CreatePostView selectedVariant={variant} isPagesLoading={isLoading} />;

  /**
   * @deprecated
   */
  return (
    <>
      <div className="overflow-scroll h-[500px]">
        <div className="flex justify-between content-center">
          <div className="flex items-center">
            {isInCreateMode ? (
              <button onClick={() => setIsInCreateMode(false)}>
                <MdArrowBackIos style={{ fontSize: "21px" }} />
              </button>
            ) : (
              <></>
            )}
            <span className="font-bold text-2xl">
              {isInCreateMode ? "Create Post" : "Select A Page"}
            </span>
          </div>
          {isInCreateMode ? (
            <></>
          ) : (
            <button
              className="px-8 bg-green-600 text-white rounded-md"
              onClick={handleActionButtonClick}
            >
              {isLoadingPages ? (
                <Loader />
              ) : selectedPage ? (
                "Create Post"
              ) : (
                "Refresh"
              )}
            </button>
          )}
        </div>
        <div className="mt-8 flex items-start">
          <div className="flex flex-col">
            {accessToken &&
              pagesData &&
              pagesData.map((item, index) => {
                return (
                  <button
                    key={item.id}
                    onClick={() => onPageButtonClick({ page: item })}
                  >
                    <div
                      className={`flex rounded-md ${item.id == selectedPage?.id ? "bg-primary" : "bg-slate-300"} p-2 mb-2 pr-8`}
                    >
                      <div className="rounded-md py-2 px-4 bg-slate-500 font-bold text-2xl text-white mr-4">
                        {item.name[0]}
                      </div>
                      <div className="flex flex-col items-start">
                        <p
                          className={`font-bold ${item.id == selectedPage?.id ? "text-white" : "text-black"}`}
                        >
                          {item.name}
                        </p>
                        <p
                          className={`${item.id == selectedPage?.id ? "text-slate-300" : "text-slate-800"} text-xs`}
                        >
                          {item.id}
                        </p>
                      </div>
                    </div>{" "}
                  </button>
                );
              })}
          </div>
          {selectedPage ? (
            isInCreateMode ? (
              <CreatePostView
                pageId={selectedPage.id}
                pageAccessToken={selectedPage.page_access_token}
                selectedVariant={variant}
              />
            ) : (
              selectedPage.account_type === "facebook" && (
                <ViewFacebookPosts
                  pageId={selectedPage.id}
                  pageAccessToken={selectedPage.page_access_token}
                />
              )
            )
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}
