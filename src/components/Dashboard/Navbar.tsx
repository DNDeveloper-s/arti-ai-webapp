"use client";

import Logo from "@/components/Logo";
import CTAButton from "@/components/CTAButton";
import { IoMdSettings } from "react-icons/io";
import Link from "next/link";
import React from "react";
import CreditCounter from "../CreditCounter";

export default function Navbar() {
  return (
    <div className="flex h-20 w-full px-5 justify-between items-center">
      <Logo />
      <div className="flex gap-2 items-center">
        <Link href={"/artibot/create"} prefetch={true}>
          <CTAButton className="py-1.5 mr-2 rounded-lg text-sm">
            <span>Start Chat</span>
          </CTAButton>
        </Link>
        <Link href="/settings">
          <IoMdSettings
            className="cursor-pointer text-primary"
            style={{ fontSize: "24px" }}
          />
        </Link>
        <CreditCounter />
      </div>
    </div>
  );
}
