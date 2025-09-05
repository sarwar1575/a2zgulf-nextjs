// app/layout.jsx  (NO "use client" here)

import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import '../styles/globals.css'

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["300","400","500","600","700","800","900"], // jo weights chahiye
//   style: ["normal","italic"], // optional
//   variable: "--font-poppins"  // CSS variable bana dega
// });

export const metadata = {
//   title: "CAROSA: Buy & Sell Used Cars | Car Loan | New Cars",
//   description: "Buy & sell used cars, explore new cars, and get car loans.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" >
      {/* <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        />
      </head> */}
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
