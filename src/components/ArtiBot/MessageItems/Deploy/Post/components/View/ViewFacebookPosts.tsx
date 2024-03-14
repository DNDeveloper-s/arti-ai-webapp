import { SnackbarContext } from "@/context/SnackbarContext";
import { IAdVariant } from "@/interfaces/IArtiBot";
import { useContext, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { ROUTES } from "@/config/api-config";
import Loader from "@/components/Loader";
import { useGetFacebookPosts } from "@/api/user";
import useErrorNotification from "@/hooks/useErrorNotification";

export default function ViewFacebookPosts({
  pageId,
  pageAccessToken,
}: {
  pageId: string;
  pageAccessToken: string;
}) {
  const {
    data: posts,
    isError,
    isLoading,
    error,
  } = useGetFacebookPosts(pageId, pageAccessToken);

  useErrorNotification({
    isError,
    error,
    fallbackMessage: "An error occurred while fetching posts!",
  });

  return (
    <>
      <div className="flex flex-col p-6 rounded-lg bg-white ml-4 text-black">
        {isLoading && (
          <center>
            <Loader />
          </center>
        )}
        {posts &&
          posts.map((e, item) => (
            <div key={e.id} className="mb-2">
              <img
                src={e.full_picture}
                height={120}
                width={120}
                className="rounded-lg mb-1"
              />
              <p>{e.message}</p>
              <div className="flex mt-2">
                <p className="mr-2">Likes : {e.likes?.data.length ?? 0}</p>
                <p className="mr-2">
                  Comments : {e.comments?.data.length ?? 0}
                </p>
                <p>Shares : {e.shares?.count ?? 0}</p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
