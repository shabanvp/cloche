import { UserDashboardClient } from "@/components/UserDashboardClient";

export const metadata = {
  title: "Saved Venues - Cloche Dashboard",
};

export default function SavedVenuesPage() {
  return <UserDashboardClient initialTab="saved-venues" />;
}
