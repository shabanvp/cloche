import { UserDashboardClient } from "@/components/UserDashboardClient";

export const metadata = {
  title: "Saved Inspirations - Cloche Dashboard",
};

export default function SavedInspirationsPage() {
  return <UserDashboardClient initialTab="saved-inspirations" />;
}
