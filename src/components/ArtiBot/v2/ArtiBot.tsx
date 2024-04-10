import Logo from "@/components/Logo";
import Link from "next/link";
import ArtiBotTextArea from "./ArtiBotTextArea";
import GetAdButton from "../GetAdButton";
import { colors } from "@/config/theme";
import Snackbar from "@/components/Snackbar";
import ArtiBotMessageArea from "./ArtiBotMessageArea";
import { ClientMessageContextProvider } from "@/context/ClientMessageContext";

interface ArtiBotProps {
  hideHeader?: boolean;
}
export default function ArtiBot(props: ArtiBotProps) {
  const { hideHeader } = props;
  return (
    <div className={`flex h-full overflow-hidden`}>
      <div className="bg-secondaryBackground flex-1 relative flex flex-col font-diatype overflow-hidden ">
        <>
          {!hideHeader && (
            <div className="flex justify-center h-16 py-2 px-6 box-border items-center bg-secondaryBackground shadow-[0px_1px_1px_0px_#000]">
              <Link href="/" className="flex justify-center items-center">
                <Logo width={35} className="mr-2" height={35} />
                <h3 className="text-lg">Arti AI</h3>
              </Link>
            </div>
          )}
          <ArtiBotMessageArea />
        </>
      </div>
    </div>
  );
}
