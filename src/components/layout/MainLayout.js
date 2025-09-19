'use client';

import dynamic from 'next/dynamic';
import Navbar from '../shared/Navbar';




export default function MainLayout({ children }) {
  return (
    <>
     
      

      {/* <Navbar /> */}
      <main>{children}</main>
      {/* <Footer /> */}
    </>
  );
}
