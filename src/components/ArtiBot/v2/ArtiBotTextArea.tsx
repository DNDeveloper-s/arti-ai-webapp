import { colors } from "@/config/theme";
import { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface ArtiBotTextAreaProps {
  enableMessageInput: boolean;
  handleSubmitMessage: () => void;
  handleFocusInput?: () => void;
  handleBlurInput?: () => void;
}
export default function ArtiBotTextArea(props: ArtiBotTextAreaProps) {
  const {
    enableMessageInput,
    handleSubmitMessage,
    handleFocusInput,
    handleBlurInput,
  } = props;
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [areaHeight, setAreaHeight] = useState(48);
  return (
    <div
      className="flex w-full max-w-[900px] mx-auto h-[4.5rem] relative items-end pb-2 px-3 bg-secondaryBackground"
      style={{
        height: areaHeight > 0 ? `calc(4.5rem + ${areaHeight}px)` : "4.5rem",
      }}
    >
      {/* TODO: Enable the Get Ad Now Button */}
      {/* {showGetAdNowButton && (
                <GetAdButton
                  adGenerated={Boolean(adCreative)}
                  onClick={async (setLoading) => {
                    await handleGetAdNowButton();
                    setLoading(false);
                  }}
                />
              )} */}
      <div
        className={
          "flex-1 relative rounded-xl bg-background h-[70%] mb-1 mx-3 " +
          (!enableMessageInput
            ? " opacity-60 pointer-events-none cursor-none"
            : "")
        }
      >
        <TextareaAutosize
          ref={areaRef}
          value={inputValue}
          onChange={(e) => {
            areaRef.current &&
              areaRef.current.scrollTo({
                top: areaRef.current.scrollTop + 10,
                left: 0,
              });
            setInputValue(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmitMessage();
            }
            if (e.key === "Enter" && e.shiftKey) {
              areaRef.current &&
                areaRef.current.scrollTo({
                  top: areaRef.current.scrollTop + 10,
                  left: 0,
                });
            }
          }}
          onHeightChange={(e) => {
            // 48 is default height of textarea
            setAreaHeight(e - 48);
          }}
          onFocus={handleFocusInput ?? (() => {})}
          onBlur={handleBlurInput ?? (() => {})}
          minRows={1}
          maxRows={3}
          placeholder="Type here..."
          className="outline-none caret-primary placeholder-gray-500 resize-none whitespace-pre-wrap active:outline-none bg-background rounded-xl w-full h-full p-3 px-6 absolute bottom-0"
        />
        <input
          type="text"
          className="outline-none active:outline-none bg-transparent w-full h-full p-3 px-6"
          placeholder="Type here..."
        />
      </div>

      <svg
        onClick={() => handleSubmitMessage()}
        xmlns="http://www.w3.org/2000/svg"
        width={19}
        height={19}
        fill={colors.primary}
        className="mb-[1.25rem] cursor-pointer"
      >
        <path d="M18.57 8.793 1.174.083A.79.79 0 0 0 .32.18.792.792 0 0 0 .059.97l2.095 7.736h8.944v1.584H2.153L.027 18.002A.793.793 0 0 0 .818 19c.124-.001.246-.031.356-.088l17.396-8.71a.791.791 0 0 0 0-1.409Z" />
      </svg>
    </div>
  );
}
