import React from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  CheckboxGroup,
  Chip,
  Input,
  Switch,
  cn,
} from "@nextui-org/react";
import { Divider } from "antd";
import Image from "next/image";
import { carouselImage1 as ProfileImage } from "@/assets/images/carousel-images";

const BILLING_EVENT = [{ name: "Impressions", uid: "impressions" }];

const CUSTOM_AUDIENCES = [
  { name: "Website Audience", uid: "website_audience" },
  { name: "Audience", uid: "audience" },
];

const ZIP_CODES = [
  { uid: "10001", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10002", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10003", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10004", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10005", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10006", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10007", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10008", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10009", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10010", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10011", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10012", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10013", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10014", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10015", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10016", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10017", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10018", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10019", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10020", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10021", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10022", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10023", name: "UA Ukraine 123 Chernyakhiv" },
  { uid: "10024", name: "UA Ukraine 123 Chernyakhiv" },
];

const CTA = [
  { name: "Book Travel", value: "BOOK_TRAVEL" },
  { name: "Contact Us", value: "CONTACT_US" },
  { name: "Donate", value: "DONATE" },
  { name: "Donate Now", value: "DONATE_NOW" },
  { name: "Download", value: "DOWNLOAD" },
  { name: "Get Directions", value: "GET_DIRECTIONS" },
  { name: "Go Live", value: "GO_LIVE" },
  { name: "Interested", value: "INTERESTED" },
  { name: "Learn More", value: "LEARN_MORE" },
  { name: "Like Page", value: "LIKE_PAGE" },
  { name: "Message Page", value: "MESSAGE_PAGE" },
  { name: "Raise Money", value: "RAISE_MONEY" },
  { name: "Save", value: "SAVE" },
  { name: "Send Tip", value: "SEND_TIP" },
  { name: "Shop Now", value: "SHOP_NOW" },
  { name: "Sign Up", value: "SIGN_UP" },
  { name: "View Instagram Profile", value: "VIEW_INSTAGRAM_PROFILE" },
  { name: "Instagram Message", value: "INSTAGRAM_MESSAGE" },
  { name: "Loyalty Learn More", value: "LOYALTY_LEARN_MORE" },
  { name: "Purchase Gift Cards", value: "PURCHASE_GIFT_CARDS" },
  { name: "Pay to Access", value: "PAY_TO_ACCESS" },
  { name: "See More", value: "SEE_MORE" },
  { name: "Try in Camera", value: "TRY_IN_CAMERA" },
  { name: "WhatsApp Link", value: "WHATSAPP_LINK" },
  { name: "Book Now", value: "BOOK_NOW" },
  { name: "Check Availability", value: "CHECK_AVAILABILITY" },
  { name: "Order Now", value: "ORDER_NOW" },
  { name: "WhatsApp Message", value: "WHATSAPP_MESSAGE" },
  { name: "Get Mobile App", value: "GET_MOBILE_APP" },
  { name: "Install Mobile App", value: "INSTALL_MOBILE_APP" },
  { name: "Use Mobile App", value: "USE_MOBILE_APP" },
  { name: "Install App", value: "INSTALL_APP" },
  { name: "Use App", value: "USE_APP" },
  { name: "Play Game", value: "PLAY_GAME" },
  { name: "Watch Video", value: "WATCH_VIDEO" },
  { name: "Watch More", value: "WATCH_MORE" },
  { name: "Open Link", value: "OPEN_LINK" },
  { name: "No Button", value: "NO_BUTTON" },
  { name: "Listen Music", value: "LISTEN_MUSIC" },
  { name: "Mobile Download", value: "MOBILE_DOWNLOAD" },
  { name: "Get Offer", value: "GET_OFFER" },
  { name: "Get Offer View", value: "GET_OFFER_VIEW" },
  { name: "Buy Now", value: "BUY_NOW" },
  { name: "Buy Tickets", value: "BUY_TICKETS" },
  { name: "Update App", value: "UPDATE_APP" },
  { name: "Bet Now", value: "BET_NOW" },
  { name: "Add to Cart", value: "ADD_TO_CART" },
  { name: "Sell Now", value: "SELL_NOW" },
  { name: "Get Showtimes", value: "GET_SHOWTIMES" },
  { name: "Listen Now", value: "LISTEN_NOW" },
  { name: "Get Event Tickets", value: "GET_EVENT_TICKETS" },
  { name: "Remind Me", value: "REMIND_ME" },
  { name: "Search More", value: "SEARCH_MORE" },
  { name: "Pre Register", value: "PRE_REGISTER" },
  { name: "Swipe Up Product", value: "SWIPE_UP_PRODUCT" },
  { name: "Swipe Up Shop", value: "SWIPE_UP_SHOP" },
  { name: "Play Game on Facebook", value: "PLAY_GAME_ON_FACEBOOK" },
  { name: "Visit World", value: "VISIT_WORLD" },
  { name: "Open Instant App", value: "OPEN_INSTANT_APP" },
  { name: "Join Group", value: "JOIN_GROUP" },
  { name: "Get Promotions", value: "GET_PROMOTIONS" },
  { name: "Send Updates", value: "SEND_UPDATES" },
  { name: "Inquire Now", value: "INQUIRE_NOW" },
  { name: "Visit Profile", value: "VISIT_PROFILE" },
  { name: "Chat on WhatsApp", value: "CHAT_ON_WHATSAPP" },
  { name: "Explore More", value: "EXPLORE_MORE" },
  { name: "Confirm", value: "CONFIRM" },
  { name: "Join Channel", value: "JOIN_CHANNEL" },
  { name: "Call", value: "CALL" },
  { name: "Missed Call", value: "MISSED_CALL" },
  { name: "Call Now", value: "CALL_NOW" },
  { name: "Call Me", value: "CALL_ME" },
  { name: "Apply Now", value: "APPLY_NOW" },
  { name: "Buy", value: "BUY" },
  { name: "Get Quote", value: "GET_QUOTE" },
  { name: "Subscribe", value: "SUBSCRIBE" },
  { name: "Record Now", value: "RECORD_NOW" },
  { name: "Vote Now", value: "VOTE_NOW" },
  { name: "Give Free Rides", value: "GIVE_FREE_RIDES" },
  { name: "Register Now", value: "REGISTER_NOW" },
  { name: "Open Messenger Ext", value: "OPEN_MESSENGER_EXT" },
  { name: "Event RSVP", value: "EVENT_RSVP" },
  { name: "Civic Action", value: "CIVIC_ACTION" },
  { name: "Send Invites", value: "SEND_INVITES" },
  { name: "Refer Friends", value: "REFER_FRIENDS" },
  { name: "Request Time", value: "REQUEST_TIME" },
  { name: "See Menu", value: "SEE_MENU" },
  { name: "Search", value: "SEARCH" },
  { name: "Try It", value: "TRY_IT" },
  { name: "Try On", value: "TRY_ON" },
  { name: "Link Card", value: "LINK_CARD" },
  { name: "Dial Code", value: "DIAL_CODE" },
  { name: "Find Your Groups", value: "FIND_YOUR_GROUPS" },
  { name: "Start Order", value: "START_ORDER" },
];

const SOCIAL_PAGES = [
  { name: "Michael Scott", uid: "michael_scott" },
  { name: "Dwight Schrute", uid: "dwight_schrute" },
  { name: "Jim Halpert", uid: "jim_halpert" },
  { name: "button", uid: "button" },
];

export default function CreateAd() {
  const [isSelected, setIsSelected] = React.useState(false);
  return (
    <form action="" className="flex gap-4 pb-6 overflow-hidden flex-1">
      <div className="flex flex-col gap-4 justify-between flex-1">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="!text-gray-500 !text-small">
              Basic Info
            </label>
            <Autocomplete
              inputProps={{
                classNames: {
                  input: "!text-white",
                  label: "!text-gray-500",
                },
              }}
              label="Campaign"
              placeholder={"Select Campaign"}
            >
              {CTA.map((optimisationGoal) => (
                <AutocompleteItem
                  key={optimisationGoal.value}
                  textValue={optimisationGoal.name}
                >
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {optimisationGoal.name}
                  </div>
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <Autocomplete
              inputProps={{
                classNames: {
                  input: "!text-white",
                  label: "!text-gray-500",
                },
              }}
              label="Ad Set"
              placeholder={"Select Ad Set"}
            >
              {CTA.map((optimisationGoal) => (
                <AutocompleteItem
                  key={optimisationGoal.value}
                  textValue={optimisationGoal.name}
                >
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {optimisationGoal.name}
                  </div>
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <Divider className="my-2" />
            <Input
              classNames={{
                label: "!text-gray-500",
              }}
              label="Ad Name"
              variant="flat"
              // errorMessage={formState.errors.description?.message}
            />
          </div>
          <Input
            classNames={{
              label: "!text-gray-500",
            }}
            label="Primary Text"
            variant="flat"
            // errorMessage={formState.errors.description?.message}
          />
          <Autocomplete
            inputProps={{
              classNames: {
                input: "!text-white",
                label: "!text-gray-500",
              },
            }}
            label="Call to Action"
            placeholder={"Select CTA"}
          >
            {CTA.map((optimisationGoal) => (
              <AutocompleteItem
                key={optimisationGoal.value}
                textValue={optimisationGoal.name}
              >
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {optimisationGoal.name}
                </div>
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>
        <div className="w-full flex justify-start gap-2 text-small items-center">
          <Switch
            defaultSelected
            classNames={{
              // wrapper: "flex w-full justify-between items-center gap-3",
              label: "!text-gray-300 !text-small",
            }}
            color="primary"
            size="sm"
          >
            Active
          </Switch>
        </div>

        <Button type="submit" color="primary">
          <span>Create Adset</span>
        </Button>
      </div>

      <div className="flex flex-col gap-4 flex-1 space-between">
        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          <CheckboxGroup
            label="Select Ad Variants"
            defaultValue={["buenos-aires", "london"]}
            classNames={{
              label: "!text-gray-500 !text-small",
              wrapper: "overflow-auto !flex-col flex-nowrap",
              base: "overflow-hidden",
            }}
            orientation="vertical"
          >
            <Checkbox
              classNames={{
                base: cn(
                  "inline-flex w-full max-w-md bg-content2",
                  "hover:bg-content3 items-center justify-start",
                  "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                  "data-[selected=true]:border-primary, !m-0"
                ),
                label: "w-full",
              }}
              isSelected={isSelected}
              onValueChange={setIsSelected}
              value="buenos-aires"
            >
              <div className="w-full flex justify-between gap-2">
                <div className="flex gap-2">
                  <div className="w-12 flex-shrink-0 h-12 overflow-hidden">
                    <Image
                      className="w-full h-full object-cover hover:object-contain"
                      src={ProfileImage}
                      alt="Profile Image"
                    />
                  </div>
                  <span className="text-small max-w-[170px]">
                    This is some ad objective of your choice
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {/* <span className="text-tiny text-default-500">
                              Facebook
                            </span> */}
                  <Chip color="success" size="sm" variant="flat">
                    New
                  </Chip>
                </div>
              </div>
            </Checkbox>
            <Checkbox
              classNames={{
                base: cn(
                  "inline-flex w-full max-w-md bg-content2",
                  "hover:bg-content3 items-center justify-start",
                  "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                  "data-[selected=true]:border-primary, !m-0"
                ),
                label: "w-full",
              }}
              isSelected={isSelected}
              onValueChange={setIsSelected}
              value="buenos-aires"
            >
              <div className="w-full flex justify-between gap-2">
                <div className="flex gap-2">
                  <div className="w-12 flex-shrink-0 h-12 overflow-hidden">
                    <Image
                      className="w-full h-full object-cover hover:object-contain"
                      src={ProfileImage}
                      alt="Profile Image"
                    />
                  </div>
                  <span className="text-small max-w-[170px]">
                    This is some ad objective of your choice
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {/* <span className="text-tiny text-default-500">
                              Facebook
                            </span> */}
                  <Chip color="success" size="sm" variant="flat">
                    New
                  </Chip>
                </div>
              </div>
            </Checkbox>
            <Checkbox
              classNames={{
                base: cn(
                  "inline-flex w-full max-w-md bg-content2",
                  "hover:bg-content3 items-center justify-start",
                  "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                  "data-[selected=true]:border-primary, !m-0"
                ),
                label: "w-full",
              }}
              isSelected={isSelected}
              onValueChange={setIsSelected}
              value="buenos-aires"
            >
              <div className="w-full flex justify-between gap-2">
                <div className="flex gap-2">
                  <div className="w-12 flex-shrink-0 h-12 overflow-hidden">
                    <Image
                      className="w-full h-full object-cover hover:object-contain"
                      src={ProfileImage}
                      alt="Profile Image"
                    />
                  </div>
                  <span className="text-small max-w-[170px]">
                    This is some ad objective of your choice
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {/* <span className="text-tiny text-default-500">
                              Facebook
                            </span> */}
                  <Chip color="success" size="sm" variant="flat">
                    New
                  </Chip>
                </div>
              </div>
            </Checkbox>
            <Checkbox
              classNames={{
                base: cn(
                  "inline-flex w-full max-w-md bg-content2",
                  "hover:bg-content3 items-center justify-start",
                  "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                  "data-[selected=true]:border-primary, !m-0"
                ),
                label: "w-full",
              }}
              isSelected={isSelected}
              onValueChange={setIsSelected}
              value="buenos-aires"
            >
              <div className="w-full flex justify-between gap-2">
                <div className="flex gap-2">
                  <div className="w-12 flex-shrink-0 h-12 overflow-hidden">
                    <Image
                      className="w-full h-full object-cover hover:object-contain"
                      src={ProfileImage}
                      alt="Profile Image"
                    />
                  </div>
                  <span className="text-small max-w-[170px]">
                    This is some ad objective of your choice
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {/* <span className="text-tiny text-default-500">
                              Facebook
                            </span> */}
                  <Chip color="success" size="sm" variant="flat">
                    New
                  </Chip>
                </div>
              </div>
            </Checkbox>
            <Checkbox
              classNames={{
                base: cn(
                  "inline-flex w-full max-w-md bg-content2",
                  "hover:bg-content3 items-center justify-start",
                  "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                  "data-[selected=true]:border-primary, !m-0"
                ),
                label: "w-full",
              }}
              isSelected={isSelected}
              onValueChange={setIsSelected}
              value="buenos-aires"
            >
              <div className="w-full flex justify-between gap-2">
                <div className="flex gap-2">
                  <div className="w-12 flex-shrink-0 h-12 overflow-hidden">
                    <Image
                      className="w-full h-full object-cover hover:object-contain"
                      src={ProfileImage}
                      alt="Profile Image"
                    />
                  </div>
                  <span className="text-small max-w-[170px]">
                    This is some ad objective of your choice
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {/* <span className="text-tiny text-default-500">
                              Facebook
                            </span> */}
                  <Chip color="success" size="sm" variant="flat">
                    New
                  </Chip>
                </div>
              </div>
            </Checkbox>
            <Checkbox
              classNames={{
                base: cn(
                  "inline-flex w-full max-w-md bg-content2",
                  "hover:bg-content3 items-center justify-start",
                  "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                  "data-[selected=true]:border-primary, !m-0"
                ),
                label: "w-full",
              }}
              isSelected={isSelected}
              onValueChange={setIsSelected}
              value="london"
            >
              <div className="w-full flex justify-between gap-2">
                <div className="flex gap-2">
                  <div className="w-12 flex-shrink-0 h-12 overflow-hidden">
                    <Image
                      className="w-full h-full object-cover hover:object-contain"
                      src={ProfileImage}
                      alt="Profile Image"
                    />
                  </div>
                  <span className="text-small max-w-[170px]">
                    This is some ad objective of your choice
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {/* <span className="text-tiny text-default-500">
                              Facebook
                            </span> */}
                  {/* <Chip color="success" size="sm" variant="flat"></Chip> */}
                </div>
              </div>
            </Checkbox>
            <Checkbox
              classNames={{
                base: cn(
                  "inline-flex w-full max-w-md bg-content2",
                  "hover:bg-content3 items-center justify-start",
                  "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                  "data-[selected=true]:border-primary, !m-0"
                ),
                label: "w-full",
              }}
              isSelected={isSelected}
              onValueChange={setIsSelected}
              value="nonon"
            >
              <div className="w-full flex justify-between gap-2">
                <div className="flex gap-2">
                  <div className="w-12 flex-shrink-0 h-12 overflow-hidden">
                    <Image
                      className="w-full h-full object-cover hover:object-contain"
                      src={ProfileImage}
                      alt="Profile Image"
                    />
                  </div>
                  <span className="text-small max-w-[170px]">
                    This is some ad objective of your choice
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {/* <span className="text-tiny text-default-500">
                              Facebook
                            </span>
                            <Chip color="success" size="sm" variant="flat">
                              Active
                            </Chip> */}
                </div>
              </div>
            </Checkbox>
            <Checkbox
              classNames={{
                base: cn(
                  "inline-flex w-full max-w-md bg-content2",
                  "hover:bg-content3 items-center justify-start",
                  "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                  "data-[selected=true]:border-primary, !m-0"
                ),
                label: "w-full",
              }}
              isSelected={isSelected}
              onValueChange={setIsSelected}
              value="123"
            >
              <div className="w-full flex justify-between gap-2">
                <div className="flex gap-2">
                  <div className="w-12 flex-shrink-0 h-12 overflow-hidden">
                    <Image
                      className="w-full h-full object-cover hover:object-contain"
                      src={ProfileImage}
                      alt="Profile Image"
                    />
                  </div>
                  <span className="text-small max-w-[170px]">
                    This is some ad objective of your choice
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {/* <span className="text-tiny text-default-500">
                              Facebook
                            </span>
                            <Chip color="success" size="sm" variant="flat">
                              Active
                            </Chip> */}
                </div>
              </div>
            </Checkbox>
          </CheckboxGroup>
          <Divider className="my-2" />
          <Autocomplete
            inputProps={{
              classNames: {
                input: "!text-white",
                label: "!text-gray-500",
              },
            }}
            label="Social Media Page"
            placeholder={"Select Page"}
            selectedKey={"michael_scott"}
          >
            {SOCIAL_PAGES.map((billingEvent, ind) => {
              const isLastItem = ind === SOCIAL_PAGES.length - 1;
              return (
                <AutocompleteItem
                  key={billingEvent.uid}
                  textValue={billingEvent.name}
                  classNames={{
                    base: isLastItem ? "!bg-transparent" : "",
                    selectedIcon: isLastItem ? "hidden" : "",
                  }}
                  isReadOnly={isLastItem}
                >
                  {isLastItem ? (
                    <div className="flex flex-1">
                      <Button className="w-full">Create Social Page</Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {billingEvent.name}
                    </div>
                  )}
                </AutocompleteItem>
              );
            })}

            {/* <AutocompleteItem key={"billingEvent.uid"} textValue={"Nice one"}>
                
              </AutocompleteItem> */}
          </Autocomplete>
        </div>
      </div>
    </form>
  );
}
