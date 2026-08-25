import { UserDashboardClient } from "@/components/UserDashboardClient";

export const metadata = {
  title: "Account Settings - Cloche Dashboard",
};

export default function AccountSettingsPage() {
  return <UserDashboardClient initialTab="settings" />;
}
