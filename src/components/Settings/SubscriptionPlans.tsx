import { useCreatePayment, useGetProducts } from "@/api/payment";
import { Button, Divider, Progress, Spinner } from "@nextui-org/react";
import { useEffect, useRef } from "react";
import { MdArrowRight } from "react-icons/md";
import { RiFolderAddFill } from "react-icons/ri";

export default function SubscriptionPlans() {
  const { data: product, isFetching, isLoading } = useGetProducts();

  const {
    mutate: postRefillCredit,
    isPending,
    isSuccess,
    data,
  } = useCreatePayment();

  const selectedPriceRef = useRef<string | null>(null);

  const startSubscription = (price_id: string) => {
    selectedPriceRef.current = price_id;
    postRefillCredit({ mode: "subscription", price_id });
  };

  useEffect(() => {
    if (isSuccess) {
      window.open(data.url, "_self");
    }
  }, [isSuccess, data]);
  return (
    <div className="flex items-center justify-center gap-14 py-14">
      {isLoading && <Spinner size="lg" label="Fetching plans" />}
      {product &&
        product.prices.map((price, ind) => (
          <div
            key={price.id}
            className={
              "relative bg-gray-900 border border-gray-700 rounded-lg p-4 w-[280px] " +
              (ind === 1 ? "scale-125" : "")
            }
          >
            {ind === 1 && (
              <div className="absolute text-xs bg-primary rounded-full px-2 py-0.5 transform left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                <span className="text-xs text-white">Recommended</span>
              </div>
            )}
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-3xl font-bold">{price.name}</h2>
              <p className="text-xl font-medium text-primary">
                $ {(price.amount / 100).toFixed(2)}/m
              </p>
            </div>
            <Divider className="my-7 w-[80%] mx-auto" />
            <div className="flex flex-col gap-2 px-3">
              <div className="flex items-center text-xs gap-3">
                <RiFolderAddFill className="text-success" />
                <span>One request at a time</span>
              </div>
              <div className="flex items-center text-xs gap-3">
                <RiFolderAddFill className="text-success" />
                <span>Up to 2 brands</span>
              </div>
              <div className="flex items-center text-xs gap-3">
                <RiFolderAddFill className="text-success" />
                <span>3x Revisions per design</span>
              </div>
              <div className="flex items-center text-xs gap-3">
                <RiFolderAddFill className="text-success" />
                <span>Average 2-3 days delivery</span>
              </div>
            </div>
            <Button
              color="primary"
              size="md"
              className="text-sm flex items-center justify-center gap-2 w-full mt-7"
              onClick={() => startSubscription(price.id)}
              isLoading={isPending && selectedPriceRef.current === price.id}
              isDisabled={isPending}
            >
              <span>Get Started</span>
              <MdArrowRight className="text-lg" />
            </Button>
          </div>
        ))}
      {/* <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 w-[280px]">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold">Standard</h2>
          <p className="text-xl font-medium text-primary">$ 29.99/m</p>
        </div>
        <Divider className="my-7 w-[80%] mx-auto" />
        <div className="flex flex-col gap-2 px-3">
          <div className="flex items-center text-xs gap-3">
            <RiFolderAddFill className="text-success" />
            <span>One request at a time</span>
          </div>
          <div className="flex items-center text-xs gap-3">
            <RiFolderAddFill className="text-success" />
            <span>Up to 2 brands</span>
          </div>
          <div className="flex items-center text-xs gap-3">
            <RiFolderAddFill className="text-success" />
            <span>3x Revisions per design</span>
          </div>
          <div className="flex items-center text-xs gap-3">
            <RiFolderAddFill className="text-success" />
            <span>Average 2-3 days delivery</span>
          </div>
        </div>
        <Button
          color="primary"
          size="md"
          className="text-sm flex items-center justify-center gap-2 w-full mt-7"
        >
          <span>Get Started</span>
          <MdArrowRight className="text-lg" />
        </Button>
      </div>
      <div className="bg-gray-900 relative border border-gray-700 rounded-lg p-4 w-[280px] scale-125">
        <div className="absolute text-xs bg-primary rounded-full px-2 py-0.5 transform left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <span className="text-xs text-white">Recommended</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold">Standard</h2>
          <p className="text-xl font-medium text-primary">$ 29.99/m</p>
        </div>
        <Divider className="my-7 w-[80%] mx-auto" />
        <div className="flex flex-col gap-2 px-3">
          <div className="flex items-center text-xs gap-3">
            <RiFolderAddFill className="text-success" />
            <span>One request at a time</span>
          </div>
          <div className="flex items-center text-xs gap-3">
            <RiFolderAddFill className="text-success" />
            <span>Up to 2 brands</span>
          </div>
          <div className="flex items-center text-xs gap-3">
            <RiFolderAddFill className="text-success" />
            <span>3x Revisions per design</span>
          </div>
          <div className="flex items-center text-xs gap-3">
            <RiFolderAddFill className="text-success" />
            <span>Average 2-3 days delivery</span>
          </div>
        </div>
        <Button
          color="primary"
          size="md"
          className="text-sm flex items-center justify-center gap-2 w-full mt-7"
        >
          <span>Get Started</span>
          <MdArrowRight className="text-lg" />
        </Button>
      </div> */}
      {product && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 w-[280px]">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold">Enterprise</h2>
            <p className="text-xl font-medium">Custom Plan</p>
          </div>
          <Divider className="my-7 w-[80%] mx-auto" />
          <div className="flex flex-col gap-4 px-3 text-xs text-center mx-auto max-w-[170px]">
            <p>Want a customized design plan for your company?</p>
            <p>We are ready to server</p>
          </div>
          <Button
            color="primary"
            size="md"
            className="text-sm flex items-center justify-center gap-2 w-full mt-7"
            isDisabled
          >
            <span>Get Started</span>
            <MdArrowRight className="text-lg" />
          </Button>
        </div>
      )}
    </div>
  );
}
