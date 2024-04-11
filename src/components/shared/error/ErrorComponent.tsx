import useIsProduction from "@/hooks/useIsProduction";
import useOrigin from "@/hooks/useOrigin";

interface ErrorComponentProps {
  error: Error;
  reset: () => void;
}

function formatErrorMessage(message: string) {
  return `ClientError: - ${message ?? "Something went wrong"}`;
}

export default function ErrorComponent(props: ErrorComponentProps) {
  const isProduction = useIsProduction();
  return (
    <div className="flex justify-center items-center my-1">
      <p className="text-danger text-sm font-bold">
        {!isProduction
          ? formatErrorMessage(props.error.message)
          : `ClientError: - Something went wrong! Please contact support.`}
      </p>
    </div>
  );
}
