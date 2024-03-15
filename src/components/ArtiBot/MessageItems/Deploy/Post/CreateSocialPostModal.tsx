import { useUserPages } from "@/api/user";
import UiModal from "@/components/shared/renderers/UiModal";
import { SnackbarContext } from "@/context/SnackbarContext";
import { Platform, useUser } from "@/context/UserContext";
import { wait } from "@/helpers";
import { useYupValidationResolver } from "@/hooks/useYupValidationResolver";
import { IAdVariant } from "@/interfaces/IArtiBot";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { Key, useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { trueGray } from "tailwindcss/colors";
import { object, string } from "yup";

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

interface CreateSocialPostModalContentProps {
  selectedVariant: IAdVariant;
}
function CreateSocialPostModalContent(
  props: CreateSocialPostModalContentProps
) {
  const { selectedVariant } = props;
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

  const accessToken = Platform.getPlatform(
    state.data?.facebook
  )?.userAccessToken;

  const {
    // data: pagesData,
    // isError,
    // isSuccess,
    error,
    refetch,
    isLoading: isPagesLoading,
  } = useUserPages(accessToken);

  const pageIdValue = watch("pageId");
  const facebookPages = state.data?.facebook?.pages;

  useEffect(() => {
    if (selectedVariant.text) {
      setValue("description", selectedVariant.text);
    }
  }, [selectedVariant.text, setValue]);

  const onSubmit: SubmitHandler<CreatePostFormValues> = async (data) => {
    console.log("data - ", data);
    setLoading(true);
    setSnackBarData({
      status: "info",
      message: "Posting...",
    });

    await wait(2000);

    setLoading(false);
  };

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">
            Create Social Media Post
          </ModalHeader>
          <ModalBody>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col rounded-lg p-2 text-white items-center justify-center content-center"
            >
              <div className="flex gap-4 pb-5">
                {/* Post Image */}
                <div className="bg-default-100 flex flex-col rounded-md py-2 px-3">
                  <p className="mb-1 text-small origin-top-left text-gray-500 scale-85">
                    Post Image
                  </p>
                  <div className="w-[300px] flex-1 rounded overflow-hidden border border-gray-600">
                    <Image
                      className="w-full h-full object-cover hover:object-contain"
                      src={selectedVariant.imageUrl}
                      alt="placeholder"
                    />
                  </div>
                </div>
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
            </form>
          </ModalBody>
        </>
      )}
    </ModalContent>
  );
}

interface CreateSocialPostModalProps {
  open: boolean;
  handleClose: () => void;
  selectedVariant: IAdVariant;
}
export default function CreateSocialPostModal(
  props: CreateSocialPostModalProps
) {
  const { open, handleClose, selectedVariant } = props;
  return (
    <UiModal
      keepMounted={false}
      isOpen={open}
      onClose={handleClose}
      isDismissable={true}
      isKeyboardDismissDisabled={true}
      classNames={{
        wrapper: "bg-black bg-opacity-50",
        base: "max-w-[800px] w-auto",
      }}
    >
      <CreateSocialPostModalContent selectedVariant={selectedVariant} />
    </UiModal>
  );
}
