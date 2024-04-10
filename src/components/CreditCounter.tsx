import { useGetCredits } from "@/api/conversation";
import { GiTwoCoins } from "react-icons/gi";

export default function CreditCounter() {
  const { data, isFetching } = useGetCredits();
  return (
    <div
      className={
        "flex-shrink-0 flex items-center justify-center gap-2 text-sm !bg-primary !bg-opacity-20 !rounded-full py-1.5 px-3 " +
        (isFetching ? "app-shimmer w-[70px] h-[34px] animate-pulse" : "")
      }
    >
      {!isFetching && (
        <>
          <GiTwoCoins className="text-[18px] text-primary" />
          <span className="leading-[14px]">
            <span className="text-primary block font-gilroyBold text-[20px] -mb-1">
              {data?.balance ?? 0}
            </span>{" "}
            {/* <span className="text-primary text-opacity-40 text-[15px]">
            credits
          </span> */}
          </span>
        </>
      )}
    </div>
  );
}
