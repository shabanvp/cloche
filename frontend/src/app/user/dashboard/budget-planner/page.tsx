import { UserDashboardClient } from "@/components/UserDashboardClient";

export const metadata = {
  title: "Budget Planner - Cloche Dashboard",
};

export default function BudgetPlannerPage() {
  return <UserDashboardClient initialTab="budget" />;
}
