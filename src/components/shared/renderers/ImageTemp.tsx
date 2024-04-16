import { useUser } from "@/context/UserContext";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { IoMdImages } from "react-icons/io";

export default function ImageTemp(props: any) {
  const { state } = useUser();

  return state.data?.email === "ramukakano211@gmail.com" ? (
    <img {...props} />
  ) : (
    <Image {...props} />
  );
}

const FallbackImage = ({
  className,
  FallbackProps,
  ...props
}: AppDefaultImageProps) => {
  const classNames = {
    xs: {
      image: "text-sm",
      text: "text-xs mt-0.5",
    },
    sm: {
      image: "text-base",
      text: "text-sm mt-1",
    },
    md: {
      image: "text-lg",
      text: "text-base mt-1",
    },
    lg: {
      image: "text-xl",
      text: "text-lg mt-2",
    },
    xl: {
      image: "text-2xl",
      text: "text-xl mt-2",
    },
  };

  const size = FallbackProps?.size ?? "lg";

  return (
    <div
      className={
        "flex items-center justify-center aspect-square text-xl text-gray-600 bg-secondaryBackground " +
        className
      }
      {...props}
    >
      <div className="flex flex-col justify-center items-center">
        <IoMdImages className={classNames[size].image} />
        <span className={classNames[size].text}>Image not found</span>
      </div>
    </div>
  );
};

interface AppDefaultImageProps
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  fallback?: ReactNode;
  FallbackProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { size: "xs" | "sm" | "md" | "lg" | "xl" };
}
export const AppDefaultImage = ({
  fallback,
  FallbackProps,
  ...props
}: AppDefaultImageProps) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  return hasError ? (
    fallback ?? <FallbackImage {...props} FallbackProps={FallbackProps} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt="" onError={handleError} {...props} />
  );
};
