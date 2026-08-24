import { UserDashboardClient } from "@/components/UserDashboardClient";

export const metadata = {
  title: "My Profile - Cloche Dashboard",
};

export default function UserProfilePage() {
  return <UserDashboardClient initialTab="profile" />;
}
