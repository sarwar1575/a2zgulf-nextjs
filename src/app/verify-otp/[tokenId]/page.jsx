"use client";

import VerifyOtp from "@/components/auth/VerifyOtp";

export default function VerifyOtpPage({ params }) {
  const tokenId = params?.tokenId || "";
  return <VerifyOtp tokenId={tokenId} />;
}
