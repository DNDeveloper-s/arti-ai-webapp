import { SnackbarContext } from "@/context/SnackbarContext";
import { IAdVariant } from "@/interfaces/IArtiBot";
import { useContext } from "react";

import { IAdVariantClient } from "@/interfaces/IAdCreative";
import ClientFacebookAdVariant from "./ClientFacebookAdVariant";

export default function ClientAdVariant({
  variant,
}: {
  variant: IAdVariantClient;
}) {
  const [, setSnackbarData] = useContext(SnackbarContext).snackBarData;

  return (
    <>
      <div key={variant.variantNo} className="flex-shrink-0">
        <div className="group/variant relative">
          <ClientFacebookAdVariant
            adVariant={variant}
            className="p-3 !w-[400px] !max-w-unset border !border-gray-800 h-full bg-secondaryBackground rounded-lg"
            style={{
              fontSize: "8px",
              opacity: 1,
              pointerEvents: "all",
            }}
          />
        </div>
      </div>
    </>
  );
}
