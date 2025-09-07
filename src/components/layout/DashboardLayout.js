import DashboardNavbar from "../shared/DashboardNavbar";
import Footer from "../shared/Footer";
import Header from "../shared/Header";



export default function DashboardLayout({ children }) {
  return (
    <>
      <DashboardNavbar />
      <main className="bg-[#ECFAFF]">{children}</main>
      {/* <Footer /> */}
    </>
  );
}