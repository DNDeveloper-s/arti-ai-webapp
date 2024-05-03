import { SnackbarContext } from "@/context/SnackbarContext";
import { IAdVariant } from "@/interfaces/IArtiBot";
import { Key, useContext, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { ROUTES } from "@/config/api-config";
import { getNextImageProxyUrl, wait } from "@/helpers";
import { useUser } from "@/context/UserContext";
import { useParams, useSearchParams } from "next/navigation";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Textarea,
} from "@nextui-org/react";
import Image from "next/image";
import { object, string } from "yup";
import { useYupValidationResolver } from "@/hooks/useYupValidationResolver";
import { SubmitHandler, useForm } from "react-hook-form";
import Element from "@/components/shared/renderers/Element";

interface CreatePostFormValues {
  imageUrl: string;
  description: string;
  pageId: string;
}

const validationSchema = object({
  imageUrl: string().required("Image URL is required"),
  description: string().required("Description is required"),
  pageId: string().required("Page is required"),
});

export default function CreatePostView({
  selectedVariant,
  isPagesLoading,
}: {
  selectedVariant: IAdVariant;
  isPagesLoading: boolean;
}) {
  const [errorMessage, setErrorMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [snackBarData, setSnackBarData] =
    useContext(SnackbarContext).snackBarData;
  const { state } = useUser();
  const searchParams = useSearchParams();
  const resolver = useYupValidationResolver(validationSchema);
  const { handleSubmit, formState, setValue, getValues, watch } =
    useForm<CreatePostFormValues>({
      resolver,
    });

  const pageIdValue = watch("pageId");
  const facebookPages = state.data?.facebook.pages;

  let isImageReady = imageUrl && imageUrl.length > 0;

  const createPost = async () => {
    try {
      if (isLoading || !state.data) return;
      setLoading(true);
      const response = await axios.post(ROUTES.SOCIAL.FACEBOOK_POSTS, {
        post: {
          url: getNextImageProxyUrl(
            isImageReady ? imageUrl : selectedVariant.imageUrl!
          ),
          message: selectedVariant.text,
        },
        page_id: pageId,
        access_token: pageAccessToken,
        user_id: state.data.id,
        conversation_id: searchParams.get("conversation_id") as string,
        variant_id: selectedVariant.id,
        ad_creative_id: selectedVariant.adCreativeId,
      });

      if (response.status === 200) {
        setSnackBarData({
          status: "success",
          message: "Your post was published successfully.",
        });
      }
    } catch (error: any) {
      setSnackBarData({
        status: "error",
        message: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const onImageUrlChange = (e: any) => {
    setImageUrl(e.target.value);
  };

  useEffect(() => {
    setImageUrl(selectedVariant.imageUrl!);
    setValue("imageUrl", selectedVariant.imageUrl!);
  }, [selectedVariant.imageUrl, setValue]);

  useEffect(() => {
    if (selectedVariant.text) {
      setValue("description", selectedVariant.text);
    }
  }, [selectedVariant.text, setValue]);

  const onSubmit: SubmitHandler<CreatePostFormValues> = async (data) => {
    setLoading(true);
    setSnackBarData({
      status: "info",
      message: "Posting...",
    });

    await wait(2000);

    setLoading(false);
  };

  return (
    <>
      <div className="max-h-[80vh] overflow-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col rounded-lg p-2 text-white items-center justify-center content-center"
        >
          <div className="flex flex-col gap-4">
            <div className="text-white font-bold text-lg my-2">
              <h2>Create Social Media Post</h2>
            </div>
            <div className="flex gap-4">
              {/* Post Image */}
              <div className="bg-default-100 flex flex-col rounded-md py-2 px-3">
                <p className="mb-1 text-small origin-top-left text-gray-500 scale-85">
                  Post Image
                </p>
                <div className="w-[300px] flex-1 rounded overflow-hidden border border-gray-600">
                  <Image
                    className="w-full h-full object-cover hover:object-contain"
                    src={isImageReady ? imageUrl : selectedVariant.imageUrl!}
                    alt="placeholder"
                  />
                </div>
              </div>
              <Element
                type="p"
                className="mt-1 text-xs text-danger-500"
                content={formState.errors.imageUrl?.message}
              />
              <div className="flex flex-col w-[300px] justify-between gap-6">
                <div className="flex flex-col gap-6">
                  {/* Post Description Input */}
                  <Textarea
                    isReadOnly
                    classNames={{
                      label: "!text-gray-500",
                    }}
                    label="Post Description"
                    value={selectedVariant.text}
                    variant="flat"
                    maxRows={7}
                    errorMessage={formState.errors.description?.message}
                  />
                  {/* Select Page Dropdown */}
                  <Autocomplete
                    inputProps={{
                      classNames: {
                        input: "!text-white",
                        label: "!text-gray-500",
                      },
                    }}
                    isDisabled={isPagesLoading}
                    label="Social Media Page"
                    placeholder={
                      isPagesLoading ? "Fetching Pages..." : "Select a Page"
                    }
                    onSelectionChange={(key: Key) => {
                      setValue("pageId", key as string);
                    }}
                    selectedKey={pageIdValue}
                    errorMessage={formState.errors.pageId?.message}
                  >
                    {facebookPages && facebookPages.length > 0 ? (
                      facebookPages.map((page) => (
                        <AutocompleteItem key={page.id} textValue={page.name}>
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={page.picture}
                              className="w-6 h-6"
                              alt="Page"
                            />
                            {page.name}
                          </div>
                        </AutocompleteItem>
                      ))
                    ) : (
                      <AutocompleteItem key={"no-page-found"} isReadOnly>
                        No pages found
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </div>
                <Button
                  className="mt-4 w-full text-white"
                  color="primary"
                  isLoading={isLoading}
                  type="submit"
                >
                  {isLoading ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
