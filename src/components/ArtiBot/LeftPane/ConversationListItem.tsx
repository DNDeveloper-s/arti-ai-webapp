import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import { getConversationURL } from "@/helpers";
import { ConversationType } from "@/interfaces/IConversation";
import useConversations from "@/hooks/useConversations";
import { useParams, useSearchParams } from "next/navigation";
import useAdCreatives from "@/hooks/useAdCreatives";
import Image1, { StaticImageData } from "next/image";
import { useConversation } from "@/context/ConversationContext";
import { IoMdImages } from "react-icons/io";

export function NoImage({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={
        "w-full h-full flex rounded items-center justify-center text-xl text-gray-600 bg-secondaryBackground " +
        (className ?? "")
      }
    >
      {/* <svg
				xmlns="http://www.w3.org/2000/svg"
				xmlSpace="preserve"
				width={512}
				height={512}
				style={{
					enableBackground: "new 0 0 512 512",
					fill: 'gray'
				}}
				viewBox="0 0 530 530"
				className={'w-[70%] h-[70%]'}
			>
				<path
					d="M255.79 71.94h.42c45.44-.5 112.98 5.8 134.62 10.12l.11.02c33.24 6.45 66.11 37.96 73.33 70.29 6.48 31.24 9.65 63.66 9.71 99.05-.04 22.55-1.34 43.86-3.95 64.41-21.38-28.91-45.22-58.63-68.93-85.17-12.44-13.84-30.92-19.91-49.28-19.99-13.28.06-26.6 3.27-37.67 10.26l173.59 171.75c6.34-10.77 11.05-22.27 13.66-34.05l.05-.24c7.02-33.8 10.47-68.77 10.54-106.97-.06-38.11-3.51-73.08-10.54-106.91l-.05-.24c-10.48-47.33-54.83-90.09-103.18-99.49-26.68-5.32-95.99-11.33-142.23-10.85-37.52-.39-90.16 3.49-122.96 7.8l34.84 34.47c27.92-2.56 61.62-4.55 87.91-4.26zM57.41 20.4c-7.46-7.38-19.5-7.32-26.88.14s-7.32 19.5.14 26.88l25.7 25.43c-22.65 18.67-39.78 44.25-45.79 71.42l-.05.24C3.51 178.29.07 213.26 0 251.49c.07 38.11 3.51 73.08 10.53 106.91l.05.25c10.48 47.32 54.82 90.08 103.17 99.49 26.68 5.33 95.99 11.35 142.24 10.85 1.78.02 3.59.03 5.43.03 46.09 0 111.14-5.76 136.8-10.88 11.98-2.33 23.7-6.71 34.73-12.69l46.65 46.16c3.71 3.67 8.54 5.5 13.37 5.5s9.8-1.88 13.51-5.64c7.38-7.46 7.32-19.5-.14-26.88zm160.42 317.28c-12.29-15.9-25.31-31.72-38.28-46.24-9.13-10.16-22.69-14.61-36.17-14.67-13.48.06-27.04 4.51-36.17 14.67-19.46 21.78-39.02 46.47-56.06 69.99-1.44-3.6-2.6-7.24-3.41-10.9-6.48-31.24-9.65-63.66-9.71-99.05.06-35.5 3.24-67.93 9.71-99.12 4.39-19.66 18.25-38.97 35.91-52.55l43.79 43.33c-16.62 6.4-28.42 22.51-28.42 41.39 0 24.49 19.86 44.35 44.35 44.35 19.04 0 35.28-12 41.56-28.85l78.26 77.43c-16.04 20.04-31.43 40.51-45.36 60.21z"
					data-original="#000000"
				/>
			</svg> */}
      <IoMdImages />
      {children}
    </div>
  );
}

export type ImageType = StaticImageData | string;
interface CardStackImagesProps {
  images: ImageType[];
}
export const CardStackImages: FC<CardStackImagesProps> = ({
  images: _images,
}) => {
  const [images, setImages] = useState<(ImageType | null)[]>([null, null]);
  const [s, setS] = useState("");

  function loadImage(image: ImageType, index: number) {
    const img = new Image();
    img.src = image as string;

    img.onerror = () => {
      setS("e " + img.src);
      setImages((c) => {
        c[index] = null;
        return c;
      });
    };

    img.onload = () => {
      setS("s");
      setImages((c) => {
        c[index] = image;
        return c;
      });
    };
  }

  useEffect(() => {
    loadImage(_images[0], 0);
    loadImage(_images[1], 1);
  }, [_images]);

  return !images[1] && !images[2] ? (
    <div className={"w-8 h-8 rounded relative flex-shrink-0"}>
      <div
        className={
          "absolute overflow-hidden top-0 left-0 w-full h-full rounded border border-gray-700"
        }
      >
        <NoImage />
      </div>
    </div>
  ) : (
    <>
      <div className={"w-8 h-8 rounded relative flex-shrink-0"}>
        {images[1] ? (
          <div
            className={
              "absolute transform translate-x-[5px] translate-y-[5px] overflow-hidden top-0 left-0 w-full h-full rounded border border-gray-600"
            }
          >
            <Image1
              width={100}
              height={100}
              className={"w-full h-full object-cover rounded"}
              src={images[1]}
              alt={"Carousel Image"}
            />
          </div>
        ) : (
          <div
            className={
              "absolute transform translate-x-[5px] translate-y-[5px] overflow-hidden top-0 left-0 w-full h-full rounded border border-gray-700"
            }
          >
            <NoImage />
          </div>
        )}
        {images[0] ? (
          <div
            className={
              "absolute overflow-hidden top-0 left-0 w-full h-full rounded border border-gray-100"
            }
          >
            <Image1
              width={100}
              height={100}
              className={"w-full h-full object-cover rounded"}
              src={images[0]}
              alt={"Carousel Image"}
            />
          </div>
        ) : (
          <div
            className={
              "absolute overflow-hidden top-0 left-0 w-full h-full rounded border border-gray-700"
            }
          >
            <NoImage />
          </div>
        )}
      </div>
      {/*<span className='text-white'>{s}</span>*/}
    </>
  );
};

interface ConversationListItemProps {
  conversationId: string;
}
const ConversationListItem: FC<ConversationListItemProps> = ({
  conversationId,
  ...props
}) => {
  const { getConversationById } = useConversations();
  const [images, setImages] = useState<ImageType[]>([]);
  const {
    adVariantsByConversationId,
    getLastAdCreativeByConversationId,
    sortedConversationIds,
  } = useAdCreatives();
  const searchParams = useSearchParams();
  const isActive = searchParams.get("conversation_id") === conversationId;
  const { state } = useConversation();

  useEffect(() => {
    const list = getLastAdCreativeByConversationId(conversationId);
    if (!list) {
      return setImages([]);
    }
    const variantImages = list.variants
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .map((v) => v.imageUrl);
    setImages(variantImages);
  }, [
    getLastAdCreativeByConversationId,
    conversationId,
    state.adCreative.list,
  ]);

  useEffect(() => {
    // console.log('testing variantImages - ', images, conversationId);
  }, [images]);

  return (
    <Link
      href={getConversationURL(conversationId, ConversationType.AD_CREATIVE)}
      key={conversationId}
      className={
        "flex gap-4 mx-2 items-start px-4 py-3 text-gray-300 cursor-pointer hover:bg-gray-900 rounded overflow-hidden transition-all text-sm leading-6 " +
        (isActive ? "bg-gray-900" : "bg-gray-950")
      }
    >
      <CardStackImages images={images} />
      <div className={"flex-shrink-0 flex flex-col justify-center gap-1"}>
        <p className={isActive ? "text-white" : " truncate"}>
          {getConversationById(conversationId)?.project_name}
        </p>
        <p className={"text-xs text-gray-500"}>
          {getConversationById(conversationId)?.conversation_type ===
          ConversationType.STRATEGY
            ? "Strategy"
            : "Ad Creative"}
        </p>
      </div>
    </Link>
  );
};

export default ConversationListItem;
