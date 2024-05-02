import { AnimatePresence, motion } from "framer-motion";
import { use, useContext, useEffect, useRef } from "react";
import { SnackbarContext } from "@/context/SnackbarContext";
import { clearError, useConversation } from "@/context/ConversationContext";
import { Spinner } from "@nextui-org/react";

export default function Snackbar() {
  const [snackBarData, setSnackBarData] =
    useContext(SnackbarContext).snackBarData;
  const { state, dispatch } = useConversation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (snackBarData) {
      timeoutRef.current = setTimeout(() => {
        snackBarData.status !== "progress" && setSnackBarData(null);
      }, 5000);

      return () => {
        timeoutRef.current && clearTimeout(timeoutRef.current);
      };
    }
  }, [setSnackBarData, snackBarData]);

  const statusClasses = {
    success:
      "text-white border-2 border-green-500 bg-green-700 shadow-[0_0_10px_#7feda9]",
    error:
      "text-white border-2 border-red-500 bg-red-700 shadow-[0_0_10px_#ff0f0fab]",
    warning:
      "text-white border-2 border-yellow-500 bg-yellow-700 shadow-[0_0_10px_#c4995e]",
    info: "text-white border-2 border-blue-500 bg-blue-700 shadow-[0_0_10px_#95acec]",
    progress:
      "text-white border-2 border-blue-500 bg-blue-700 shadow-[0_0_10px_#95acec]",
  };

  const props = {
    container: {
      className:
        "fixed top-20 z-50 right-5 flex items-center p-4 mb-4 text-sm rounded-lg " +
        (snackBarData ? statusClasses[snackBarData.status] : ""),
    },
  };

  return (
    snackBarData && (
      <AnimatePresence mode="wait">
        <motion.div
          key={snackBarData.message + "_" + snackBarData.status}
          initial={{ x: 230, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 230, opacity: 0 }}
          className={props.container.className}
          style={{ zIndex: 100000 }}
          role="alert"
          data-testid="snackbar-container"
        >
          {snackBarData.status !== "progress" ? (
            <svg
              className="flex-shrink-0 inline w-4 h-4 mr-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
          ) : (
            <Spinner
              classNames={{
                base: "w-4 h-4",
                wrapper: "w-4 h-4",
              }}
              className="flex-shrink-0 inline w-4 h-4 mr-3"
            />
          )}
          <span
            data-testid={"snackbar-status"}
            data-status={snackBarData.status}
            className="sr-only capitalize"
          >
            {snackBarData.status}
          </span>
          <div data-testid="snackbar-message">{snackBarData.message}</div>
        </motion.div>
      </AnimatePresence>
    )
  );
}
