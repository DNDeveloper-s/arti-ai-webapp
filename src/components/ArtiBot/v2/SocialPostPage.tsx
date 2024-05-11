"use client";

import { ConversationPost, useQueryPostsByConversationId } from "@/api/social";
import { useCredentials, useGetFacebookPage } from "@/api/user";
import PostInsightModal from "@/components/PostInsightModal";
import { AppDefaultImage } from "@/components/shared/renderers/ImageTemp";
import { useBusiness } from "@/context/BusinessContext";
import { Button, Skeleton } from "@nextui-org/react";
import dayjs from "dayjs";
import Image from "next/image";
import { use, useState } from "react";
import { LuLink } from "react-icons/lu";

function PostCardShimmer() {
  return (
    <div className="flex animate-pulse flex-col w-[200px] gap-2">
      <div className="w-full app-shimmer aspect-square overflow-hidden rounded-md flex items-center justify-center">
        {/* <AppDefaultImage
          className="w-full h-full object-cover"
          src={props.post.data.full_picture}
          alt=""
        /> */}
        {/* <LuLink className="text-xl" /> */}
      </div>
      <div className="overflow-hidden">
        <h3 className="text-small app-shimmer !inline-block rounded truncate text-gray-200">
          Nice Post to be there That can be done in any situation
        </h3>
        <p className="app-shimmer rounded !inline-block text-tiny text-gray-500 mt-1">
          25th May 2021, 12:00
        </p>
      </div>
      <div className="w-full !inline-block">
        <div className="w-full app-shimmer rounded-md">See Insights</div>
      </div>
    </div>
  );
}

interface PostCardProps {
  /**
   *
   * @param postId {Meta Post Id, not the mongo id}
   * @returns
   */
  handleClick: (postId: string) => void;
  post: Pick<ConversationPost, "postId" | "data">;
}
export function PostCard(props: PostCardProps) {
  return (
    <div className="flex flex-col w-[200px] gap-2 flex-shrink-0">
      <div className="w-full aspect-square overflow-hidden bg-gray-400 bg-opacity-20 rounded-md flex items-center justify-center">
        <AppDefaultImage
          className="w-full h-full object-cover"
          src={props.post.data.full_picture}
          alt="Post Image"
          fallback={<LuLink className="text-xl" />}
        />
        {/* <LuLink className="text-xl" /> */}
      </div>
      <div>
        <h3 className="text-small truncate text-gray-200">
          {props.post.data.message}
        </h3>
        <p className="text-tiny text-gray-500 mt-1">
          {dayjs(props.post.data.created_time).isValid() &&
            dayjs(props.post.data.created_time).format("DD MMM YYYY, HH:mm")}
        </p>
      </div>
      <div className="w-full">
        <Button
          onClick={() => props.handleClick(props.post.postId)}
          className="w-full rounded-md"
          size="sm"
          variant="flat"
        >
          See Insights
        </Button>
      </div>
    </div>
  );
}

interface SocialPostPageProps {
  conversationId: string;
}
export default function SocialPostPage(props: SocialPostPageProps) {
  const [openInsightModal, setOpenInsightModal] = useState(false);
  const [postId, setPostId] = useState<string | undefined>(undefined);
  const {
    posts,
    isFetching,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useQueryPostsByConversationId({
    conversationId: props.conversationId,
  });

  const handleFetchNextPage = () => {
    if (!isFetching && !isFetchingNextPage) fetchNextPage();
  };

  const waiting = isLoading;
  const hasNoPosts = !waiting && !posts.length;
  const hasPosts = !waiting && !!posts.length;

  const { businessMap } = useBusiness();
  const { accessToken } = useCredentials();
  const { data, isFetching: isFetchingPage } = useGetFacebookPage({
    accessToken,
    pageId: businessMap.getFacebookPage()?.provider_id,
    isInView: true,
  });

  return (
    <div className="p-10">
      <div className="flex w-full justify-start items-center mb-3">
        {isFetchingPage ? (
          <div className="flex items-center gap-4">
            <div>
              <Skeleton className="flex rounded w-10 h-10" />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Skeleton className="h-8 w-20 rounded" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded overflow-hidden">
              <AppDefaultImage
                alt=""
                src={data?.picture as string}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-medium">
              <h3>{data?.name}</h3>
            </div>
          </div>
        )}
      </div>
      <div className="mb-3">
        <h3>Posts and reels</h3>
      </div>
      {hasNoPosts && (
        <div className="w-full flex items-center justify-center">
          <p className="text-sm text-gray-500">No Posts Found</p>
        </div>
      )}
      {waiting && (
        <div className="grid grid-cols-4 gap-4">
          <PostCardShimmer />
          <PostCardShimmer />
          <PostCardShimmer />
          <PostCardShimmer />
        </div>
      )}
      {hasPosts && (
        <div className="grid grid-cols-4 gap-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              handleClick={(post_id) => {
                setOpenInsightModal(true);
                setPostId(post_id);
              }}
            />
          ))}
        </div>
      )}
      {hasNextPage && (
        <div className="w-full mt-4">
          <Button
            onClick={handleFetchNextPage}
            size="sm"
            className="w-full rounded-md"
            variant="flat"
            isLoading={isFetchingNextPage || isFetching}
          >
            {isFetchingNextPage || isFetching
              ? "Fetching more posts..."
              : "See More Posts"}
          </Button>
        </div>
      )}
      <PostInsightModal
        open={openInsightModal}
        handleClose={() => setOpenInsightModal(false)}
        post_id={postId}
      />
    </div>
  );
}
