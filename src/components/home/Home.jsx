import React from "react";
import Banner from "./Banner";
import BusinessNeeds from "./BusinessNeeds";
import BusinessNeeds2 from "./BusinessNeeds2";
import Discover from "./Discover";
import Source from "./Source";
import Ordering from "./Ordering";
import Membership from "./Membership";
import Empower from "./Empower";

export default function Home() {
  return (
    <>
      <Banner />
      <BusinessNeeds />
      <BusinessNeeds2 />
      <Discover />
      <Source />
      <Ordering />
      <Membership/>
      <Empower/>
    </>
  );
}
