import { UserDashboardClient } from "@/components/UserDashboardClient";

export const metadata = {
  title: "Saved Vendors - Cloche Dashboard",
};

export default function SavedVendorsPage() {
  return <UserDashboardClient initialTab="saved-vendors" />;
}
