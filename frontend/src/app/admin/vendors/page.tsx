import { getAllBoutiques } from "@/services/api";
import { VendorManagementClient } from "./VendorManagementClient";

export const dynamic = "force-dynamic";

export default async function AdminVendorsPage() {
  const backendVendors = await getAllBoutiques();

  return <VendorManagementClient backendVendors={backendVendors} />;
}
