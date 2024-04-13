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

const FallbackImage = ({ className, ...props }: AppDefaultImageProps) => {
  return (
    <div
      className={
        "flex items-center justify-center aspect-square text-xl text-gray-600 bg-secondaryBackground " +
        className
      }
      {...props}
    >
      <div className="flex flex-col justify-center items-center">
        <IoMdImages className="text-xl" />
        <span className="text-base mt-2">Image not found</span>
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
}
export const AppDefaultImage = ({
  fallback,
  ...props
}: AppDefaultImageProps) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  return hasError ? (
    fallback ?? <FallbackImage {...props} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt="" onError={handleError} {...props} />
  );
};
