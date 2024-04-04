import { Mock } from "@/constants/servicesData";
import Lottie from "lottie-react";
import { FC, useState } from "react";
import generatingImage from "@/assets/lottie/generating_image.json";
import errorImage from "@/assets/lottie/error.json";
import { IAdVariantClient } from "@/interfaces/IAdCreative";
import { NoImage } from "../../LeftPane/ConversationListItem";
import dummyImage from "@/assets/images/image4.webp";
import Image1 from "next/image";
import { SlOptions } from "react-icons/sl";
import { motion } from "framer-motion";

interface ClientFacebookAdVariant
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  mock?: Mock;
  forceAdVariant?: boolean;
  adVariant: IAdVariantClient;
  noExpand?: boolean;
  className?: string;
}
const ClientFacebookAdVariant: FC<ClientFacebookAdVariant> = ({
  mock = new Mock(),
  forceAdVariant,
  adVariant,
  noExpand,
  className,
  ...props
}) => {
  const [inError, setInError] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  // useEffect(() => {
  // 	if(!headingRef.current) return;
  // 	// const height = headingRef.current.offsetTop;
  // 	headingRef.current.scrollIntoView({behavior: 'smooth', block: 'start'})
  // }, [expand]);

  // useEffect(() => {
  // 	if(!adVariant.id || adVariant.id.includes('variant') || noExpand) return;
  // 	if(!adVariant.imageUrl && adVariant.imageDescription && (!inProcess || !inProcess[adVariant.id]) && (!inError || !inError[adVariant.id])) {
  // 		console.log('adVariant.id - ', adVariant.id);
  // 		updateVariantImage(dispatch, adVariant.imageDescription, adVariant.id);
  // 	}
  // }, [adVariant, dispatch, inError, inProcess, noExpand]);
  //   const [imageUrl, setImageUrl] = useState<string | null>(
  //     mock.is ? null : adVariant.imageUrl
  //   );
  //   const fallbackImage = editState.fallbackImage
  //     ? editState.fallbackImage[adVariant.id]
  //     : undefined;

  //   useEffect(() => {
  //     setImageUrl(fallbackImage ?? adVariant.imageUrl);
  //     const img = new Image();
  //     img.src = adVariant.imageUrl;
  //     img.onload = () => {
  //       setImageUrl(adVariant.imageUrl);
  //       resetImageUrl(editDispatch);
  //     };
  //     img.onloadstart = () => {
  //       console.log("testing load start");
  //     };
  //   }, [fallbackImage, adVariant.imageUrl, editDispatch]);

  //   function handleErrorImage() {
  //     if (fallbackImage) setImageUrl(fallbackImage);
  //     else setImageUrl("error");
  //   }

  let lottieAnimationJSX = (
    <div className="w-full aspect-square flex flex-col justify-center items-center">
      <Lottie
        className={"w-32 h-32"}
        animationData={generatingImage}
        loop={true}
      />
      <h6 className="text-white text-opacity-60 text-center px-5 leading-normal">
        Creating your ad variant image to make your brand shine, one pixel at a
        time.
      </h6>
    </div>
  );

  if (inError) {
    lottieAnimationJSX = (
      <div className="w-full aspect-square flex flex-col justify-center items-center">
        <Lottie
          className={"w-32 h-32"}
          animationData={errorImage}
          loop={true}
        />
        <h6 className="text-white text-opacity-60 text-center px-5 leading-normal">
          Oops! It looks like there was an issue creating your ad variant image.
          Try creating another one.
        </h6>
      </div>
    );
  }

  const imageContainerJSX =
    imageUrl === "error" ? (
      <NoImage className="!text-6xl !flex-col !aspect-square">
        <span className="text-lg mt-2">Image not found</span>
      </NoImage>
    ) : imageUrl ? (
      <Image1
        width={600}
        height={100}
        className="mb-[0.5em] w-full"
        src={imageUrl ? imageUrl : dummyImage}
        // onError={handleErrorImage}
        alt="Ad Image"
      />
    ) : (
      lottieAnimationJSX
    );

  return (
    <div
      key={adVariant.oneLiner}
      className={"ad-variant text-xs md:text-base !p-0 " + (className ?? "")}
      {...props}
    >
      <div
        className={
          "flex justify-between items-center mb-[.3em] px-[1em] pt-[1em]"
        }
      >
        <div className="flex items-center gap-[0.5em]">
          <div className="w-[2em] h-[2em] rounded-full bg-gray-700" />
          <div>
            <div className="w-[4em] h-[1em] mb-[0.2em] rounded-[.17em] bg-gray-700" />
            <div className="w-[6em] h-[1em] rounded-[.17em] bg-gray-700" />
          </div>
        </div>
        <SlOptions className="text-[1.5em]" />
      </div>
      {/*<div className="mb-[1em] px-[1em]">*/}
      <div className="mb-[1em] text-[1.6em] leading-[1.6] py-[0.6em] px-[1em] relative">
        <span
          className={
            "" +
            (mock.is
              ? " line-clamp-3 text-ellipsis"
              : " line-clamp-4 text-ellipsis min-h-[82px]")
          }
        >
          {adVariant.text}
        </span>
      </div>
      <div className="relative aspect-square">
        {imageContainerJSX}
        {/*<Image width={600} height={100} className="mb-[0.5em] w-full" src={variant && variant[adVariant['One liner']] ? variant[adVariant['One liner']] : dummyImage} alt="Ad Image" />*/}
      </div>
      <div
        className={
          "flex justify-between gap-[.8em] items-center px-[1em] mt-[1em]"
        }
      >
        <div className="relative px-2 py-2 text-[1.75em] leading-[1.3em] flex-1">
          <span>{adVariant.oneLiner}</span>
        </div>
        <div className="flex-shrink-0">
          <span
            className="cursor-pointer rounded bg-gray-700 px-[0.6em] py-[0.5em] text-[1em]"
            // onClick={() => setExpand((c) => !c)}
          >
            Learn More
          </span>
        </div>
      </div>
      <hr className="h-px my-[1em] border-0 bg-gray-700" />
      <div
        className="w-full px-[1em] pb-[1em] flex justify-between"
        style={{ zoom: mock.is ? 0.7 : 1 }}
      >
        <div className="ml-[2em] w-[6.5em] h-[2em] rounded bg-gray-700" />
        <div className="w-[6.5em] h-[2em] rounded bg-gray-700" />
        <div className="w-[6.5em] h-[2em] rounded bg-gray-700" />
        <div className="w-[2em] h-[2em] rounded-full bg-gray-700" />
      </div>
    </div>
  );
};

export default ClientFacebookAdVariant;
