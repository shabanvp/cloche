import { UserDashboardClient } from "@/components/UserDashboardClient";

export const metadata = {
  title: "Wedding Checklist - Cloche Dashboard",
};

export default function WeddingChecklistPage() {
  return <UserDashboardClient initialTab="checklist" />;
}
