import { dbImagesPrefixes } from "@/constants";
import {
  updateVariantToDB,
  useConversation,
} from "@/context/ConversationContext";
import {
  startEditingVariant,
  stopEditingVariant,
  useEditVariant,
} from "@/context/EditVariantContext";
import { SnackbarContext } from "@/context/SnackbarContext";
import { IAdVariant } from "@/interfaces/IArtiBot";
import uploadImage from "@/services/uploadImage";
import JSZip from "jszip";
import { useContext, useRef, useState } from "react";
import FacebookAdVariant from "../../FacebookAdVariant";
import { EditFacebookAdVariant } from "../../EditAdVariant/EditAdVariant";
import { MdDownload, MdOutlineModeEdit } from "react-icons/md";
import DeployButton from "@/components/ArtiBot/MessageItems/DeployButton";
import Loader from "@/components/Loader";
import { dataUrlToBase64, fetchImage } from "../../MessageItems/AdItem";
// @ts-ignore
import { saveAs } from "file-saver";

export function ConversationAdVariant({
  variantId,
  baseVariant,
}: {
  variantId: string;
  baseVariant: IAdVariant;
}) {
  const containerRef = useRef(null);
  const { dispatch, state: editState } = useEditVariant();
  const {
    dispatch: conversationDispatch,
    state,
    updateVariant,
  } = useConversation();
  const [, setSnackbarData] = useContext(SnackbarContext).snackBarData;
  const [updating, setUpdating] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const variantInState = state.variant.findOneBy("id", variantId);
  const variant = variantInState ?? baseVariant;
  const editMode = editState.variant && editState.variant.id === variantId;

  async function handleDownload() {
    if (!variant) {
      return setSnackbarData({
        message: "Failed to download ad variant",
        status: "error",
      });
    }
    setDownloading(true);
    const zip = new JSZip();
    zip.file(
      "Ad_Text.txt",
      `Ad Description - ${variant.text}\n\nAd One Liner - ${variant.oneLiner}`
    );

    const img = zip.folder("images");
    try {
      if (img) {
        console.log("variant.images - ", variant, variant.images);
        let images: any[] = [];
        if (!variant.images) {
          images = [{ url: variant.imageUrl }];
        }
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          if (!image.url) continue;
          const dataUrl = await fetchImage(image.url);
          const base64 = dataUrlToBase64(dataUrl);
          base64 && img.file(`image_${i}.png`, base64, { base64: true });
        }
      } else {
        console.error("Failed to create images folder in zip file");
      }
    } catch (e) {
      console.error("Failed to create images folder in zip file", e);
    }

    zip
      .generateAsync({ type: "blob" })
      .then(function (content) {
        // see FileSaver.js
        setDownloading(false);
        saveAs(content, `Ad-Variant_${variantId}.zip`);
      })
      .catch((err) => {
        console.error("Failed to create zip file", err);
        setSnackbarData({
          message: "Failed to download ad variant",
          status: "error",
        });
        setDownloading(false);
      });
  }

  async function handleEdit() {
    if (!variant) return null;
    stopEditingVariant(dispatch);
    startEditingVariant(dispatch, variant);
  }

  function editVariantClose() {
    stopEditingVariant(dispatch);
  }

  async function handleSaveVariant() {
    // updateVariant(editState.variant as IAdVariant);
    if (!editState.variant) {
      return setSnackbarData({
        message: "Oops! Failed to Update Variant.",
        status: "error",
      });
    }
    setUpdating(true);

    const newVariant = { ...editState.variant };
    // newVariant.images = variantState.images;
    const variantImages = [...(editState.variantImages ?? [])];

    const usedImageUrl = newVariant.imageUrl;

    const images = [];
    for (let i = 0; i < variantImages.length; i++) {
      const image = variantImages[i];

      if (!image.get("url") && !image.get("bgImage")) continue;

      // Should get new when
      // 1. it's url matches with imageUrl
      // 2. it's url and bgImage both contains allowedBgImagesPrefixes
      const isCurrentImage = image.get("url") === editState.variant?.imageUrl;
      const cond = [
        isCurrentImage,
        dbImagesPrefixes.some(
          (prefix) =>
            image.get("url")?.includes(prefix) &&
            image.get("bgImage")?.includes(prefix)
        ),
      ];

      const shouldGetNew = cond.some((c) => c);

      if (shouldGetNew) {
        if (image.get("url")?.startsWith("blob:")) {
          // upload image to s3 and update url
          const fileName = newVariant.id + "_" + Date.now().toString() + ".png";
          const url = await uploadImage(image.get("url"), fileName);
          // const url = 'uploaded to s3 url'
          image.set("url", url);
          if (isCurrentImage) newVariant.imageUrl = url;
        } else {
          if (isCurrentImage)
            newVariant.imageUrl = image.get("url") ?? newVariant.imageUrl;
        }
        if (image.get("bgImage")?.startsWith("blob:")) {
          // upload image to s3 and update bgImage
          const fileName = newVariant.id + "_" + Date.now().toString() + ".png";
          const url = await uploadImage(image.get("bgImage"), fileName);
          // const url = 'uploaded to s3 bgImage url'
          image.set("bgImage", url);
        }
        images[i] = image.imageObj;
      } else {
        images[i] = image.baseImageObj;
      }
    }

    // console.log('testing newVariant - ', images);
    newVariant.images = images;

    const variantFromDB = await updateVariantToDB(
      conversationDispatch,
      newVariant as IAdVariant
    );
    setUpdating(false);

    if (variantFromDB) {
      stopEditingVariant(dispatch);
      return setSnackbarData({
        message: "Variant Updated Successfully",
        status: "success",
      });
    } else {
      return setSnackbarData({
        message: "Oops! Failed to Update Variant.",
        status: "error",
      });
    }
  }

  if (!variant) return null;

  return (
    <>
      <div ref={containerRef} key={variant.id} className="flex-shrink-0">
        <div className="group/variant relative">
          {!editMode ? (
            <FacebookAdVariant
              adVariant={variant}
              className="p-3 !w-[400px] !max-w-unset border !border-gray-800 h-full bg-secondaryBackground rounded-lg"
              style={{
                fontSize: "8px",
                opacity: editMode ? 0 : 1,
                pointerEvents: editMode ? "none" : "all",
              }}
              isClient={!variantInState}
            />
          ) : (
            <EditFacebookAdVariant
              showConfirmModal={false}
              setShowConfirmModal={() => {}}
              handleSaveVariant={handleSaveVariant}
              handleEditVariantClose={editVariantClose}
              adVariant={editState.variant as IAdVariant}
              className="p-3 !w-[400px] !max-w-unset border border-gray-800 h-auto rounded-lg"
              style={{ fontSize: "8px" }}
            />
          )}
          {!downloading && !updating && !editMode && (
            <div className="transition-all group-hover/variant:opacity-100 group-hover/variant:pointer-events-auto pointer-events-none opacity-0 absolute bg-black bg-opacity-70 top-0 left-0 w-full h-full flex flex-wrap justify-center gap-5 items-end pb-10">
              <button
                onClick={handleEdit}
                className="cursor-pointer text-white hover:scale-105 text-sm flex justify-center gap-2 items-center bg-gray-800 border border-gray-500 rounded py-1.5 px-4 hover:bg-gray-700 transition-all"
              >
                <MdOutlineModeEdit />
                <span>Edit</span>
              </button>
              {/*<button className='cursor-pointer text-white hover:scale-105 fill-white text-sm flex justify-center gap-2 items-center bg-gray-800 border border-gray-500 rounded py-1.5 px-4 hover:bg-gray-700 transition-all'>*/}
              {/*	<GrDeploy className='fill-white stroke-white [&>path]:stroke-white' />*/}
              {/*	<span>Deploy</span>*/}
              {/*</button>*/}
              <button
                onClick={handleDownload}
                className="cursor-pointer text-white hover:scale-105 fill-white text-sm flex justify-center gap-2 items-center bg-gray-800 border border-gray-500 rounded py-1.5 px-4 hover:bg-gray-700 transition-all"
              >
                <MdDownload className="fill-white stroke-white [&>path]:stroke-white" />
                <span>Download</span>
              </button>
              <div className="flex justify-center items-center gap-5">
                <DeployButton variant={variant} />
              </div>
            </div>
          )}
          {updating && (
            <div className="flex items-center z-30 justify-center absolute top-0 left-0 w-full h-full bg-black bg-opacity-60">
              <Loader />
            </div>
          )}
          {downloading && (
            <div className="flex items-center z-30 gap-2 justify-center absolute top-0 left-0 w-full h-full bg-black bg-opacity-60">
              <Loader className={"w-5 h-5"} />
              <span>Preparing to Download</span>
            </div>
          )}
        </div>
        {/* {isEnabled && (
            <DeployedPostCard
              isPending={isPostPending}
              isFetching={isPostFetching}
              posts={postData}
            />
          )} */}
      </div>
    </>
  );
}
