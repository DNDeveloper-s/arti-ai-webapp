import Navbar from "@/components/Dashboard/Navbar";
import WelcomeSection from "@/components/Dashboard/WelcomeSection";
import React, { useState } from "react";
import CardSection from "@/components/Dashboard/v2/CardSection";

export default function Dashboard() {

  return (
    <main className={"w-full max-w-[900px] mx-auto"}>
      <Navbar />
      <WelcomeSection />
      <CardSection />
    </main>
  );
}
