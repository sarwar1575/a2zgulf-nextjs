import DashboardPage from "@/components/dashboard/DashboardPage";
import Home from "@/components/home/Home";
import DashboardLayout from "@/components/layout/DashboardLayout";
import HomeLayout from "@/components/layout/HomeLayout";

export default async function HomePage() {
  return (
    <DashboardLayout>
      <DashboardPage />
    </DashboardLayout>
  );
}
