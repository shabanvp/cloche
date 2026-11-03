# Partner application queue proposal

## Current behavior

`frontend/src/app/api/v1/admin/vendors/route.ts` defaults to `vendors.status = 'pending'`, returns `publicationStatus`, and approves by setting `vendors.status = 'active'` and `publication_status = 'published'`. The approval handler does not read or update `vendor_profile_versions`, so approval does not depend on a version row. This is compatible with partner-created vendors that have no version row.

The visible `/admin/vendors` page currently loads `getAllBoutiques()` and maps those records into its own status model; it does not use the protected `/api/v1/admin/vendors` queue response. The vendor-management UI also drops `publication_status`. A small UI/API wiring change is needed for the two application states to be reliable in that page.

## Proposed change (do not apply here)

Use the existing authenticated queue endpoint as the admin page's source, retain `publicationStatus` in the view model, and show it beside the vendor status. The endpoint already filters pending vendors and returns the needed value.

In `frontend/src/app/admin/vendors/VendorManagementClient.tsx`, extend the view type and mapping:

```tsx
export type VendorRecord = {
  // existing fields
  status: "active" | "pending" | "suspended";
  publicationStatus?: "draft" | "under_review" | "published" | "changes_requested";
};

// When mapping the protected /api/v1/admin/vendors response:
publicationStatus: b.publicationStatus,
```

Render the application state as an additional label in the status cell:

```tsx
const applicationLabel =
  v.publicationStatus === "under_review"
    ? "Submitted for review"
    : v.publicationStatus === "draft"
      ? "Signup in progress"
      : null;
```

```tsx
<td className="p-4">
  <span>{v.status}</span>
  {applicationLabel && <span className="ml-2 text-xs">{applicationLabel}</span>}
</td>
```

The page should load the pending queue from `/api/v1/admin/vendors?status=pending` with `cache: "no-store"` and preserve the authenticated same-origin cookies. Keep the existing `PATCH /api/v1/admin/vendors` approval action: it updates the vendor row directly and already works without a `vendor_profile_versions` row. Do not add a version-row requirement to approval.

## Expected result

- `status = 'pending'` plus `publication_status = 'under_review'` is labelled **Submitted for review**.
- `status = 'pending'` plus `publication_status = 'draft'` is labelled **Signup in progress**.
- Approval continues to set `status = 'active'` and `publication_status = 'published'` on the vendor record only.

No admin queue code was changed as part of this proposal.
