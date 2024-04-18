import { useUser } from "@/context/UserContext";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { IoMdImages } from "react-icons/io";

export default function ImageTemp(props: any) {
  const { state } = useUser();

  return state.data?.email === "ramukakano211@gmail.com" ? (
    <Image {...props} />
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
  extends Omit<
    React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >,
    "src" | "ref"
  > {
  fallback?: ReactNode;
  ref?: React.Ref<HTMLImageElement>;
  src: string | StaticImport;
  FallbackProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { size: "xs" | "sm" | "md" | "lg" | "xl" };
}
export const AppDefaultImage = ({
  fallback,
  FallbackProps,
  src,
  ref,
  ...props
}: AppDefaultImageProps) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  return hasError ? (
    fallback ?? (
      <FallbackImage src={src} {...props} FallbackProps={FallbackProps} />
    )
  ) : (
    <Image
      alt=""
      onError={handleError}
      {...props}
      width={+(props.width ?? 100)}
      height={+(props.height ?? 100)}
      placeholder={"blur"}
      src={src}
    />
  );
};
