import { UserDashboardClient } from "@/components/UserDashboardClient";

export const metadata = {
  title: "Enquiries & Quotes - Cloche Dashboard",
};

export default function EnquiriesPage() {
  return <UserDashboardClient initialTab="enquiries" />;
}
