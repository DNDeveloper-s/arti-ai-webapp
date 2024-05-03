"use client";

import Loader from "@/components/Loader";
import Element from "@/components/shared/renderers/Element";
import { IFacebookPostDetailsResponse } from "@/interfaces/ISocial";
import { FacebookPost } from "@/services/Facebook";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { PiShareFat } from "react-icons/pi";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PostInsightModal from "@/components/PostInsightModal";
import { PostCard } from "../v2/SocialPostPage";

interface DeployedPostInsightProps {
  label: string;
  value: string;
  icon?: string;
}
function DeployedPostInsight(props: DeployedPostInsightProps) {
  return (
    <div className="flex flex-col justify-between gap-2 py-3 pl-3 pr-5 bg-gray-700 bg-opacity-50 rounded">
      <span className="text-[#ED02EB] text-2xl font-semibold">
        {props.value}
      </span>
      <span className="text-gray-400 text-xs">{props.label}</span>
    </div>
  );
}

interface DeployedPostCardProps {
  postInfo: IFacebookPostDetailsResponse;
}
function DeployedPostCard({ postInfo }: DeployedPostCardProps) {
  const postDetails = useMemo(() => {
    return postInfo ? FacebookPost.getInsights(postInfo) : undefined;
  }, [postInfo]);
  return (
    postDetails && (
      <div className="w-full h-auto bg-gray-800 rounded">
        <div className="flex flex-col items-center py-4">
          <div className="border-gray-500 rounded overflow-hidden w-[100px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full object-cover"
              src={postDetails.basic.full_picture}
              alt="placeholder"
            />
          </div>
          <span className="text-gray-400 text-xs mt-2">
            Posted {postDetails.basic.created_at}
          </span>
        </div>
        <div className="w-full flex justify-evenly my-3">
          <div className="flex items-center gap-2 text-lg text-blue-500">
            <div className="text-xl">
              <AiFillLike />
            </div>
            <span>{postDetails.basic.likes}</span>
          </div>
          <div className="flex items-center gap-2 text-lg text-gray-300">
            <div className="text-xl">
              <FaRegComment />
            </div>
            <span>{postDetails.basic.comments}</span>
          </div>
          <div className="flex items-center gap-2 text-lg text-gray-300">
            <div className="text-xl">
              <PiShareFat />
            </div>
            <span>{postDetails.basic.shares}</span>
          </div>
        </div>
        <Element content={postDetails.insights?.length > 0}>
          <div className="h-0 border-t border-gray-600 w-full my-5" />
          <div className="grid grid-cols-2 px-5 gap-x-4 gap-y-3 pb-4">
            {postDetails.insights.map((insight, index) => {
              return (
                <DeployedPostInsight
                  key={index}
                  label={insight.name}
                  value={insight.value.toString()}
                />
              );
            })}
          </div>
        </Element>
      </div>
    )
  );
}

interface DeployedPostCardViewProps {
  posts: IFacebookPostDetailsResponse[];
  isPending?: boolean;
  isFetching?: boolean;
}
export default function DeployPostCardView({
  posts,
  isPending,
  isFetching,
}: DeployedPostCardViewProps) {
  const [openInsightModal, setOpenInsightModal] = useState(false);
  const [postId, setPostId] = useState<string | undefined>(undefined);
  const isOnePostAvailable = posts.some((c) => c !== undefined);
  const noPostAvailable = posts.every((c) => c === undefined);
  const settings = useMemo((): Settings => {
    return {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
  }, []);

  if (noPostAvailable) {
    if (!isFetching) return null;
    return (
      <div className="flex flex-col items-center gap-2 mt-3">
        <div className="text-xs flex items-center gap-2 text-gray-400">
          <Loader className="w-5 h-5" />
          <span>Fetching Posts</span>
        </div>
      </div>
    );
  }

  console.log("postInsightModal - ", openInsightModal, postId);

  return (
    <div className="flex flex-col items-center gap-2 mt-1">
      <div className="flex w-full items-center py-1 pl-3 justify-between">
        <h2>Live Posts Insights</h2>
        {isFetching && (
          <div className="text-xs flex items-center gap-2 text-gray-400">
            <Loader className="w-5 h-5" />
            <span>Fetching Posts</span>
          </div>
        )}
      </div>
      <div className="p-2 flex gap-4 w-full overflow-auto">
        {posts.map((post: any) => {
          return (
            // <DeployedPostCard key={post?.details.id} postInfo={post} />
            <PostCard
              handleClick={(postId: string) => {
                setOpenInsightModal(true);
                setPostId(postId);
              }}
              key={post?.details.id}
              post={{ data: post.details, postId: post?.details.id }}
            />
          );
        })}
        {/* {posts.length > 1 && <Slider {...settings}></Slider>} */}
        {/* {posts.length === 1 && (
          <DeployedPostCard key={posts[0]?.details.id} postInfo={posts[0]} />
        )} */}
      </div>
      <PostInsightModal
        open={openInsightModal}
        handleClose={() => setOpenInsightModal(false)}
        post_id={postId}
      />
    </div>
  );
}
