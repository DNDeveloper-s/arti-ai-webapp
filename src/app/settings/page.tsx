'use client'

import SwitchComponent from "@/components/ArtiBot/MessageItems/Deploy/Ad/components/SwitchComponent";
import CTAButton from "@/components/CTAButton";
import Navbar from "@/components/Settings/Navbar";
import { useState } from "react";

export default function Settings() {
    const [canReceiveSuggestions, setCanReceiveSuggestions] = useState(false)

    return (
        <main className={"w-full max-w-[900px] mx-auto"}>
            <Navbar />
            <div className="bg-slate-800 ml-20 mr-20 items-center justify-center p-8 rounded-lg mt-12">
                <div className="flex py-5 justify-between">
                    <label>
                        Receive Post Suggestions
                    </label>
                    <SwitchComponent
                        checked={canReceiveSuggestions}
                        onChange={setCanReceiveSuggestions} />
                </div>
                <div className={`flex py-5 justify-between ${canReceiveSuggestions ? 'opacity-100' : 'opacity-50'}`}>
                    <label>
                        Suggestion Frequency
                    </label>
                    <select disabled={!canReceiveSuggestions} id="dropdown" name="dropdown" onChange={(a) => { }} className="border border-coolGray-500 rounded-lg p-2 outline-0 text-white bg-slate-800">
                        {['Daily', 'Weekly', 'Monthly'].map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                        ))}
                    </select>
                    {/* <SwitchComponent
                        checked={false}
                        onChange={(_) => { }} /> */}
                </div>
                <center>
                    <CTAButton className="py-3 mr-2 rounded-lg text-sm mt-10">
                        <span>Save</span>
                    </CTAButton>
                </center>
            </div>
        </main>
    )
}