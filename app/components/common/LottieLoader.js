"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import SpoonLoaderData from "../../assets/animation/Spoon_Loader.json";

export default function LottieLoader({
  fullScreen = false,
  text = "Loading...",
  size = 150,
  className = "",
}) {
  const content = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div style={{ width: size, height: size }}>
        <DotLottieReact data={SpoonLoaderData} loop={true} autoplay={true} />
      </div>
      {text && (
        <span className="text-sm font-semibold text-brand-muted mt-2">
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}
