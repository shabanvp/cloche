# Partner document type compatibility

The existing vendor document constraint appears in `database/migrations/20260805000009_vendor_create_services_pricing.sql` and is repeated in the master schema. The constraints are:

```sql
document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('kyc', 'gst_certificate', 'business_license', 'contract', 'other')),
status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
```

Compatibility with the partner function values described in the request:

| Partner value | Allowed by existing `document_type` check? |
| --- | --- |
| `business_registration` | No |
| `identity_proof` | No |
| `pan_card` | No |
| `gst_certificate` | Yes |
| `pending` as document status | Yes |

Therefore, three of the four partner document types do not fit the checked values, while the `pending` status and `gst_certificate` type do. If those functions attempt to insert the other document types into `vendor_documents`, the database constraint will reject those rows. No SQL was run and no schema changes are proposed or applied here.
