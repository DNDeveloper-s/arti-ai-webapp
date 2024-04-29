import ErrorComponent from "@/components/shared/error/ErrorComponent";
import {
  Autocomplete,
  AutocompleteItem,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import React, { FC, Key } from "react";
import {
  PreviewProps,
  previewOptions,
} from "../MessageItems/Deploy/Ad/components/Ads/Create/CreateAd";
import Link from "next/link";
import useMounted from "@/hooks/useMounted";

interface AdPreviewModalProps {
  open: boolean;
  handleClose: () => void;
  previewData: PreviewProps | null;
  title?: string;
}
const AdPreviewModal: FC<AdPreviewModalProps> = ({
  open,
  handleClose,
  previewData,
  ...props
}) => {
  const [previewOptionValue, setPreviewOptionValue] = React.useState<string>(
    previewOptions[0].uid
  );
  const mounted = useMounted();

  const previewOptionEl = previewOptions.find(
    (option) => option.uid === previewOptionValue
  )?.el;

  return (
    <Modal
      onClose={handleClose}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={open}
      portalContainer={
        mounted
          ? (document.getElementById("contextmenuportal") as HTMLElement)
          : undefined
      }
      classNames={{
        base: "!max-w-[600px] !max-h-[90vh] !w-full",
      }}
    >
      <ModalContent>
        <ModalHeader>
          <div className="w-full flex items-center justify-between">
            <span>{props.title ?? "Ad Preview"}</span>
          </div>
        </ModalHeader>
        <ModalBody className="overflow-auto">
          <ErrorBoundary errorComponent={ErrorComponent}>
            <Autocomplete
              inputProps={{
                classNames: {
                  input: "!text-white",
                  label: "!text-gray-500",
                },
              }}
              label="Preview Ad Variant"
              // disabledKeys={[]}
              placeholder={"Select Preview Style"}
              onSelectionChange={(key: Key) => {
                setPreviewOptionValue(key as string);
              }}
              selectedKey={previewOptionValue}
              isClearable={false}
            >
              {previewOptions.map((previewOption) => (
                <AutocompleteItem
                  key={previewOption.uid}
                  textValue={previewOption.name}
                >
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {previewOption.name}
                  </div>
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <Divider className="my-2" />
            <div className="flex justify-center">
              {previewData && previewOptionEl ? (
                previewOptionEl({
                  text: previewData.text,
                  image: previewData.image,
                  title: previewData?.title,
                  brandLabel: previewData?.brandLabel,
                  brandLogo: previewData?.brandLogo,
                })
              ) : (
                <div className="w-[300px] h-[400px] rounded-lg bg-gray-800 flex items-center justify-center text-lg text-gray-600">
                  <p>Select Ad variant to preview</p>
                </div>
              )}
            </div>
            {previewData?.previewLink && (
              <div className="flex justify-end my-2">
                <Link
                  href={previewData?.previewLink}
                  target="_blank"
                  className="text-primary text-sm hover:underline cursor-pointer"
                >
                  Live Preview
                </Link>
              </div>
            )}
          </ErrorBoundary>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AdPreviewModal;
