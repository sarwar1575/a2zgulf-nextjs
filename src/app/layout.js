import "../styles/globals.css";
import Providers from "../redux/Providers.";
import MainLayout from "@/components/layout/MainLayout";

export const metadata = {
  title: "My App",
  description: "Next.js + Redux Toolkit Auth",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
