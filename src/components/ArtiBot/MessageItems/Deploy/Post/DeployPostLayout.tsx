import { SnackbarContext } from "@/context/SnackbarContext";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import CreatePostView from "./components/CreatePostView";
import axios from "axios";
import { ROUTES } from "@/config/api-config";
import { IAdVariant } from "@/interfaces/IArtiBot";
import Loader from "@/components/Loader";
import ViewUserPosts from "./components/View/ViewUserPosts";
import { MdArrowBackIos, MdEmail } from "react-icons/md";
import FacebookSignInButton from "@/components/Auth/FacebookSigninButton";
import { signIn } from "next-auth/react";

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
  fetchingProviders,
}: {
  accessToken: string;
  variant: IAdVariant;
  fetchingProviders: boolean;
}) {
  const [isLoadingPages, setLoadingPages] = useState(false);
  const [snackBarData, setSnackBarData] =
    useContext(SnackbarContext).snackBarData;
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [pagesData, setPagesData] = useState<FacebookPage[]>([]);
  const [selectedPage, selectPage] = useState<FacebookPage | null>();
  const [isInCreateMode, setIsInCreateMode] = useState<boolean>(false);
  const fetchedRef = useRef(false);

  const getUserPages = useCallback(async () => {
    if (fetchingProviders || fetchedRef.current || !accessToken) return;
    selectPage(null);
    console.log(`token for get all pages: ${accessToken}`);

    try {
      if (isLoadingPages) return;
      setLoadingPages(true);
      fetchedRef.current = true;
      const response = await axios.get(ROUTES.SOCIAL.PAGES, {
        params: {
          access_token: accessToken,
        },
      });

      setPagesData(response.data.data);
    } catch (error: any) {
      setSnackBarData({
        status: "error",
        message: "An error occurred while fetching pages!",
      });
    } finally {
      setLoadingPages(false);
    }
  }, [
    accessToken,
    fetchingProviders,
    isLoadingPages,
    setPagesData,
    setSnackBarData,
  ]);

  const onPageButtonClick = async ({ page }: { page: FacebookPage }) => {
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
      getUserPages();
    }
  };

  useEffect(() => {
    getUserPages();
  }, [getUserPages]);

  function handleFacebookClick() {
    signIn("facebook", { callbackUrl: "/deploy", redirect: false });
    // const signInUrl = `https://localhost:3001/api/auth/signin/facebook`;
    // const newWindow = window.open(signInUrl, "_blank", "noopener,noreferrer");
    // window.addEventListener("message", (event) => {
    //   if (event.origin === process.env.NEXT_PUBLIC_BASE_URL) {
    //     // Check if the message indicates a successful sign-in
    //     if (event.data === "signin-success") {
    //       // Close the new window upon success
    //       if (!newWindow) return;
    //       newWindow.close();
    //     }
    //   }
    // });
  }

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
              {isLoadingPages || fetchingProviders ? (
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
            {fetchingProviders && <Loader />}
            {!accessToken && !fetchingProviders && (
              <div>
                <FacebookSignInButton
                  onClick={handleFacebookClick}
                  label={"Connect Facebook"}
                />
              </div>
            )}
            {accessToken &&
              !fetchingProviders &&
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
                pageAccessToken={
                  selectedPage.access_token ?? selectedPage.page_access_token
                }
                selectedVariant={variant}
              />
            ) : (
              <ViewUserPosts
                pageId={selectedPage.id}
                pageAccessToken={
                  selectedPage.access_token ?? selectedPage.page_access_token
                }
              />
            )
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}
