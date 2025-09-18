"use client";

import VerifyOtp from "../../../components/auth/VerifyOtp"; // path must be correct

import { useParams } from "next/navigation";

export default function VerifyOtpPage() {
  const params = useParams();
  const tokenId = params?.tokenId;

  if (!tokenId) return <div className="p-4 text-gray-500">Missing token...</div>;

  return <VerifyOtp tokenId={tokenId} />;
}
