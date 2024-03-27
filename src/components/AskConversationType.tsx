"use client";

import React, { FC, Key, use, useEffect, useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import Link from "next/link";
import Logo from "@/components/Logo";
import MessageContainer from "@/components/ArtiBot/MessageContainer";
import GetAdButton from "@/components/ArtiBot/GetAdButton";
import FileItem from "@/components/ArtiBot/MessageItems/FileItem";
import TextareaAutosize from "react-textarea-autosize";
import { colors } from "@/config/theme";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import CTAButton from "@/components/CTAButton";
import AdCreativeIcon from "@/components/shared/icons/AdCreativeIcon";
import ArtiBotPage from "@/components/ArtiBotPage";
import Modal from "@/components/Modal";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { StringUtils } from "@/lib/String";
import SocialMediaPostIcon from "./shared/icons/SocialMediaPostIcon";
import { Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";
import { useGetCampaigns, useGetUserProviders } from "@/api/user";
import SelectAdAccount, {
  SelectAdAccountPicker,
} from "./ArtiBot/MessageItems/Deploy/Ad/components/SelectAdAccount";
import SelectMetaPage from "./ArtiBot/MessageItems/Deploy/SelectMetaPage";
import { useUser } from "@/context/UserContext";
import useCampaignStore from "@/store/campaign";
import { ConversationType } from "@/interfaces/IConversation";

interface AskConversationTypeProps {}

const BotsInfo = () => {
  return (
    <div className="w-full max-w-[900px] mx-auto px-3 items-center mb-3 font-diatype">
      <div>
        <ol className="list-decimal pl-3">
          <li>
            <h2 className="font-semibold text-white mt-1 mb-0.5 text-base text-opacity-70 font-diatype">
              Ad Creative Assistant
            </h2>
            <p className="text-sm text-white text-opacity-60">
              If you need a captivating Facebook Ad or an eye-catching billboard
              campaign.
            </p>
          </li>
          <li>
            <h2 className="font-semibold text-white mt-2 mb-0.5 text-base text-opacity-70 font-diatype">
              Post Creative Assistant
            </h2>
            <p className="text-sm text-white text-opacity-60">
              Craft and schedule eye-catching social media posts effortlessly,
              driving engagement and boosting your online presence.
            </p>
          </li>
        </ol>
        {/*<p className="text-sm text-white text-opacity-60 font-light mt-4 font-diatype">Please tap on your choice to initiate a conversation. You can always return to this screen to choose the other bot for a different conversation. Let's create memorable ads and strategize for success!</p>*/}
      </div>
    </div>
  );
};

const BasicConversationInfo = ({
  projectName,
  setProjectName,
  setProjectType,
}: {
  projectName: string;
  setProjectName: (val: string) => void;
  setProjectType: (
    val: ConversationType | null
  ) => void | React.Dispatch<React.SetStateAction<ConversationType | null>>;
}) => {
  return (
    <div className={"flex-1 p-5 flex flex-col"}>
      <div className="w-full flex justify-between items-center pb-3 py-1">
        <div className="flex items-center gap-1">
          {/*<MdArrowBackIos onClick={() => router.push('/')} style={{fontSize: '18px', cursor: 'pointer'}}/>*/}
          <h2>Let&apos;s Begin Your Journey</h2>
        </div>
        <div className="group relative flex items-center cursor-pointer justify-center">
          <AiOutlineInfoCircle />
          <div className="transition-all shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto absolute rounded top-[130%] min-w-[350px] right-0 bg-black border border-gray-800 p-1">
            <BotsInfo />
          </div>
        </div>
      </div>
      <hr className="border-gray-500" />

      <div className="mt-3 text-sm text-gray-400 leading-relaxed">
        <span>
          {/*Welcome to Arti AI🌟. What brings you here today? Let's get started by telling us your project name, and then choose a bot to assist you in creating memorable ads or planning your business strategy.*/}
          Get started by telling us your project name.
        </span>
      </div>

      <div className="my-3">
        <label className="text-sm text-secondaryText" htmlFor="">
          Project Name<span className="text-red-600">*</span>
        </label>
        <input
          placeholder="Enter your project name here..."
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required={true}
          type={"text"}
          className={
            "w-full mt-1 bg-secondaryText placeholder:text-xs placeholder:opacity-30 bg-opacity-25 outline-none border-2 border-opacity-0 border-red-600 rounded-lg text-md py-2 px-3 transition-all"
          }
        />
      </div>
      <div className="flex-1" />
      {
        <AnimatePresence mode="wait">
          {new StringUtils(projectName).isNotEmpty().isMinLength(1).get() && (
            <motion.div
              initial={{ height: 0 }}
              transition={{ duration: 0.1 }}
              animate={{ height: "106px" }}
              exit={{ height: "0px" }}
              className="w-full my-5 transition-all overflow-hidden"
            >
              <div className="text-sm mb-2 mx-1 text-gray-400 leading-relaxed">
                <span>
                  {/*Welcome to Arti AI🌟. What brings you here today? Let's get started by telling us your project name, and then choose a bot to assist you in creating memorable ads or planning your business strategy.*/}
                  Choose a bot to assist you
                </span>
              </div>
              <div className="flex gap-5 mx-1 justify-between items-center">
                <div className="flex-1">
                  <CTAButton
                    onClick={() => {
                      setProjectType(ConversationType.AD_CREATIVE);
                    }}
                    className="py-3 rounded-lg w-full justify-center flex gap-3 items-center text-sm bg-transparent border-2 border-primary"
                  >
                    <>
                      <div className="w-6">
                        <AdCreativeIcon fill={colors.primary} />
                      </div>
                      <span className="text-primary">
                        Ad Creative Assistant
                      </span>
                    </>
                  </CTAButton>
                  <span className="text-xs text-gray-500">
                    For creating eye-catching ads
                  </span>
                </div>
                <div className="flex-1">
                  <CTAButton
                    onClick={() => {
                      setProjectType(ConversationType.SOCIAL_MEDIA_POST);
                    }}
                    className="py-3 rounded-lg w-full justify-center flex gap-3 items-center text-sm bg-transparent border-2 border-primary"
                  >
                    <>
                      <div className="w-6">
                        <SocialMediaPostIcon
                          className="w-full h-auto"
                          fill={colors.primary}
                        />
                      </div>
                      <span className="text-primary">
                        Post Creative Assistant
                      </span>
                    </>
                  </CTAButton>
                  <span className="text-xs text-gray-500">
                    Craft & schedule posts for impact
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      }
    </div>
  );
};

const AdvancedConversationInfo = ({
  projectType,
  goBack,
}: {
  projectType: ConversationType;
  goBack: () => void;
}) => {
  const router = useRouter();
  const { data: campaigns, isFetching: isCampaignsFetching } =
    useGetCampaigns();
  const [campaignValue, setCampaignValue] = useState("");
  const [pageValue, setPageValue] = useState<string | undefined>();
  const { selectedAccountId } = useCampaignStore();

  return (
    <div className={"flex-1 p-5 flex flex-col"}>
      <div className="w-full flex justify-between items-center pb-3 py-1">
        <div className="flex items-center gap-1">
          <MdArrowBackIos
            onClick={goBack}
            style={{ fontSize: "18px", cursor: "pointer" }}
          />
          <h2>Set Up Social Media Integration.</h2>
        </div>
        <div className="group relative flex items-center cursor-pointer justify-center">
          <AiOutlineInfoCircle />
          <div className="transition-all shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto absolute rounded top-[130%] min-w-[350px] right-0 bg-black border border-gray-800 p-1">
            <BotsInfo />
          </div>
        </div>
      </div>
      <hr className="border-gray-500" />

      <div className="mt-3 text-sm text-gray-400 leading-relaxed">
        <span>
          {/*Welcome to Arti AI🌟. What brings you here today? Let's get started by telling us your project name, and then choose a bot to assist you in creating memorable ads or planning your business strategy.*/}
          Customize Your Social Media Defaults, Which Can Be Modified Anytime
          Later.
        </span>
      </div>

      <div className="my-3 flex flex-col gap-2">
        {projectType === ConversationType.AD_CREATIVE ? (
          <>
            <SelectAdAccount />
            <Autocomplete
              inputProps={{
                classNames: {
                  input: "!text-white",
                  label: "!text-gray-500",
                },
              }}
              isDisabled={isCampaignsFetching || !selectedAccountId}
              label="Campaign"
              placeholder={
                selectedAccountId
                  ? isCampaignsFetching
                    ? "Fetching Campaigns"
                    : "Select Campaign"
                  : "Select Ad Account First"
              }
              onSelectionChange={(key: Key) => {
                setCampaignValue(key.toString());
              }}
              selectedKey={campaignValue}
            >
              {campaigns && campaigns.length > 0 ? (
                campaigns.map((campaign) => (
                  <AutocompleteItem key={campaign.id} textValue={campaign.name}>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {campaign.name}
                    </div>
                  </AutocompleteItem>
                ))
              ) : (
                <AutocompleteItem key={"no-country-found"} isReadOnly>
                  No campaigns found
                </AutocompleteItem>
              )}
            </Autocomplete>
          </>
        ) : (
          <SelectMetaPage pageValue={pageValue} setPageValue={setPageValue} />
        )}
      </div>
      <div className="flex-1" />
      <div className="flex gap-4">
        <Button color="primary" className="flex-1">
          <Link
            href={"/artibot?conversation_type=" + projectType}
            prefetch={true}
          >
            <span>Continue</span>
          </Link>
        </Button>
        <Button color="default" className="flex-1">
          <Link
            href={"/artibot?conversation_type=" + projectType}
            prefetch={true}
          >
            <span>Skip</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

const AskConversationType: FC<AskConversationTypeProps> = (props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasConversationTypeParam = searchParams.get("conversation_type");
  const [projectName, setProjectName] = React.useState<string>("");
  const [projectType, setProjectType] =
    React.useState<ConversationType | null>();

  const { data: accounts } = useGetUserProviders();
  const { setAccounts } = useUser();

  useEffect(() => {
    if (accounts) {
      setAccounts(accounts);
    }
  }, [setAccounts, accounts]);

  if (hasConversationTypeParam) {
    return <ArtiBotPage projectName={projectName} />;
  }

  function handleGoBack() {
    setProjectType(null);
  }

  return (
    <div className={`flex h-screen overflow-hidden`}>
      <div
        className={
          "bg-secondaryBackground flex-1 relative flex flex-col font-diatype overflow-hidden"
        }
      >
        <div className="flex justify-between h-16 py-2 px-6 box-border items-center bg-secondaryBackground shadow-[0px_1px_1px_0px_#000]">
          <Link
            className="flex items-center cursor-pointer"
            prefetch={true}
            href="/"
          >
            <MdArrowBackIos style={{ fontSize: "21px" }} />
            <span className="ml-0.5 -mb-0.5 text-white text-opacity-60">
              Dashboard
            </span>
          </Link>
          <Link href="/" className="flex justify-center items-center">
            <Logo width={35} className="mr-2" height={35} />
            <h3 className="text-lg">Arti AI</h3>
          </Link>
          <div className="flex items-center opacity-0 pointer-events-none">
            <MdArrowBackIos />
            <span className="text-white text-opacity-50">Dashboard</span>
          </div>
        </div>
        <Modal
          BackdropProps={{ className: "hidden pointer-events-none" }}
          PaperProps={{
            className: "rounded-lg !min-h-0 w-[90vw] max-w-[600px]",
          }}
          setOpen={() => {}}
          open={true}
        >
          <>
            {!projectType ? (
              <BasicConversationInfo
                projectName={projectName}
                setProjectName={setProjectName}
                setProjectType={setProjectType}
              />
            ) : (
              <AdvancedConversationInfo
                projectType={projectType}
                goBack={handleGoBack}
              />
            )}
          </>
        </Modal>
        <div className={"flex-1 flex flex-col-reverse overflow-auto"}>
          <div />
          {/*<div className="w-full max-w-[900px] mx-auto px-3 flex justify-center items-center mb-3">*/}
          {/*	<div className="h-0.5 mr-5 flex-1 bg-gray-800" />*/}
          {/*	<div className="flex justify-center items-center font-light text-sm font-diatype text-white text-opacity-50">*/}
          {/*		<span>Hey</span>*/}
          {/*		<Image width={20} height={20} src={WavingHand} alt="Arti AI welcomes you"/>*/}
          {/*		<span>, How can Arti Ai help you?</span>*/}
          {/*	</div>*/}
          {/*	<div className="h-0.5 ml-5 flex-1 bg-gray-800" />*/}
          {/*</div>*/}
        </div>
        <div className="blur-sm pointer-events-none flex w-full max-w-[900px] mx-auto h-[4.5rem] relative items-end pb-2 px-3 bg-secondaryBackground">
          <div className="flex-1 relative rounded-xl bg-background h-[70%] mb-1 mx-3">
            <TextareaAutosize
              minRows={1}
              maxRows={3}
              placeholder="Type here..."
              className="outline-none caret-primary resize-none whitespace-pre-wrap active:outline-none placeholder-gray-200 bg-background rounded-xl w-full h-full p-3 px-6 absolute bottom-0"
            />
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={19}
            height={19}
            fill={colors.primary}
            className="mb-[1.25rem] cursor-pointer"
          >
            <path d="M18.57 8.793 1.174.083A.79.79 0 0 0 .32.18.792.792 0 0 0 .059.97l2.095 7.736h8.944v1.584H2.153L.027 18.002A.793.793 0 0 0 .818 19c.124-.001.246-.031.356-.088l17.396-8.71a.791.791 0 0 0 0-1.409Z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AskConversationType;
