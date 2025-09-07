import Footer from "../shared/Footer";
import Header from "../shared/Header";



export default function HomeLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}